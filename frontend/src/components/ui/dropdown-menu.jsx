// src/components/ui/dropdown-menu.jsx
import * as React from "react";
import { cn } from "../../lib/utils";

export function DropdownMenu({ className = "", children, ...props }) {
  return (
    <div className={cn("relative", className)} {...props}>
      {children}
    </div>
  );
}

export function DropdownMenuTrigger({ className = "", children, ...props }) {
  return (
    <button className={cn("outline-none", className)} {...props}>
      {children}
    </button>
  );
}

export function DropdownMenuContent({ className = "", children, ...props }) {
  return (
    <div
      className={cn(
        "absolute z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuItem({ className = "", children, ...props }) {
  return (
    <div
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuLabel({ className = "", children, ...props }) {
  return (
    <div
      className={cn("px-2 py-1.5 text-sm font-semibold", className)}
      {...props}
    >
      {children}
    </div>
  );
}

export function DropdownMenuSeparator({ className = "", ...props }) {
  return (
    <div className={cn("-mx-1 my-1 h-px bg-muted", className)} {...props} />
  );
}

// DELETE THIS ENTIRE BLOCK - it's causing duplicate exports
// export {
//   DropdownMenu,
//   DropdownMenuTrigger,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator
// };