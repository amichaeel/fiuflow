import { getAuthSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function ProfilePage() {
    const session = await getAuthSession();
    if (!session?.user) redirect("/");

    const user = session.user;

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-blue-900 py-10 px-6">
                <div className="max-w-6xl mx-auto flex items-center gap-6">
                    <Avatar className="h-36 w-36 cursor-pointer">
                        {session.user.image ? (
                            <AvatarImage src={session.user.image} alt="User avatar" className="h-36 w-36" />
                        ) : (
                            <AvatarFallback className="text-4xl h-36 w-36">
                                {session.user.name ? session.user.name.charAt(0).toUpperCase() + session.user.name.split(" ")[1].charAt(0) : "?"}
                            </AvatarFallback>
                        )}
                    </Avatar>
                    <div className="text-white">
                        <h1 className="text-3xl font-bold">{user.name}</h1>
                        {/* <p className="text-sm">
                            Send notifications to <a href={`mailto:${user.email}`} className="underline">{user.email}</a>
                        </p> */}
                        {/* <Link href="#" className="text-sm text-red-400 underline mt-1 inline-block">
                            Delete account
                        </Link> */}
                    </div>
                </div>
            </div>

            {/* Main Section */}
            <div className="max-w-6xl mx-auto mt-6 px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Import Schedule */}
                <div className="bg-white p-6 rounded shadow col-span-2">
                    <h2 className="font-semibold text-xl mb-1">Import your class schedule</h2>
                    <p className="text-sm text-gray-600 mb-4">
                        To export it to Google Calendar, Calendar.app, etc...
                    </p>
                    <Button disabled className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold">
                        Add current / upcoming term
                    </Button>
                </div>

                {/* Profile Completion Checklist */}
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="font-semibold text-xl mb-4">Complete your profile</h2>
                    <ul className="space-y-2 text-md">
                        <li><span className="inline-block w-3 h-3 rounded-full border mr-2" />Upload your schedule</li>
                        <li><span className="inline-block w-3 h-3 rounded-full border mr-2" />Import your previous courses</li>
                        <li><span className="inline-block w-3 h-3 rounded-full border mr-2" />Add a rating for a course</li>
                        <li><span className="inline-block w-3 h-3 rounded-full border mr-2" />Add a rating for a professor</li>
                    </ul>
                </div>

                {/* Add Previous Terms */}
                <div className="bg-white p-6 rounded shadow col-span-2">
                    <h2 className="font-semibold text-xl mb-2">Add courses you have taken</h2>
                    <Button disabled className="bg-yellow-400 text-black hover:bg-yellow-500 font-semibold">
                        Add previous terms
                    </Button>
                </div>

                {/* Favourites */}
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="font-semibold text-xl mb-4">Favorites</h2>
                    <div className="flex items-start gap-2">
                        <span>No favorites found.</span>
                        {/* <span className="text-yellow-500">★</span>
                        <div>
                            <Link href="#" className="text-sm font-semibold text-[#B7862C] underline">
                                CS 115
                            </Link>
                            <p className="text-xs text-gray-600">Introduction to Computer Science 1</p>
                        </div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}
