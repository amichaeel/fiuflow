import * as React from "react"
import { Search } from "lucide-react"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  const isSearch = type === "search";
  return (
    <div className="relative flex items-center w-full">
      {isSearch ? (
        <span className="absolute left-3 text-muted-foreground pointer-events-none">
          <Search size={16} />
        </span>
      ) : null}
      <input
        type={type}
        data-slot="input"
        className={cn(
          "file:text-foreground rounded-xs placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 bg-accent border py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          isSearch ? "pl-9 pr-3" : "px-3",
          "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          className
        )}
        {...props}
      />
    </div>
  )
}

export { Input }