import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/db";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import CredentialsProvider from "next-auth/providers/credentials";
import { AuthOptions, getServerSession } from "next-auth";
import bcrypt from "bcrypt";

export const authOptions: AuthOptions = {
    adapter: PrismaAdapter(prisma),
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID!,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        }),
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID!,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET!,
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) return null;

                const user = await prisma.user.findUnique({
                    where: { email: credentials.email },
                });

                if (!user || !user.password) return null;

                const valid = await bcrypt.compare(credentials.password, user.password);
                if (!valid) return null;

                return {
                    id: user.id,
                    email: user.email,
                    name: `${user.firstName} ${user.lastName}`,
                };
            },
        }),
    ],
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
        signIn: "/",
    },
    callbacks: {
        async signIn({ user, account }) {
            if (account?.provider === "google" || account?.provider === "facebook") {
                let existingUser = await prisma.user.findUnique({
                    where: { email: user.email ?? undefined },
                });

                // If no user yet, create it with profile data
                if (!existingUser) {
                    existingUser = await prisma.user.create({
                        data: {
                            email: user.email!,
                            name: user.name,
                            firstName: user.name?.split(" ")[0] ?? "",
                            lastName: user.name?.split(" ").slice(1).join(" ") ?? "",
                            image: user.image,
                        },
                    });
                } else {
                    await prisma.user.update({
                        where: { id: existingUser.id },
                        data: {
                            name: existingUser.name ?? user.name,
                            image: existingUser.image ?? user.image,
                            firstName:
                                existingUser.firstName ||
                                user.name?.split(" ")[0] ||
                                existingUser.firstName,
                            lastName:
                                existingUser.lastName ||
                                user.name?.split(" ").slice(1).join(" ") ||
                                existingUser.lastName,
                        },
                    });
                }

                const linkedAccount = await prisma.account.findFirst({
                    where: {
                        provider: account.provider,
                        providerAccountId: account.providerAccountId,
                    },
                });

                if (!linkedAccount) {
                    await prisma.account.create({
                        data: {
                            userId: existingUser.id,
                            type: "oauth",
                            provider: account.provider,
                            providerAccountId: account.providerAccountId,
                            access_token: account.access_token,
                            token_type: account.token_type,
                            scope: account.scope,
                            id_token: account.id_token,
                            refresh_token: account.refresh_token,
                            expires_at: account.expires_at ?? undefined,
                        },
                    });
                }
            }

            return true;
        },
    },

};

export function getAuthSession() {
    return getServerSession(authOptions);
}
