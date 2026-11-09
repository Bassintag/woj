import { CompassIcon, HeartIcon, NotepadIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export function Navbar() {
  return (
    <nav className="sticky bottom-0 mt-auto flex flex-row items-center gap-4 rounded-2xl bg-bg px-layout py-6 shadow-base">
      <NavbarLink to="/">
        <CompassIcon />
        Explorer
      </NavbarLink>
      <NavbarLink to="/favorites">
        <HeartIcon />
        Favoris
      </NavbarLink>
      <NavbarLink to="/list">
        <NotepadIcon />
        Courses
      </NavbarLink>
    </nav>
  );
}

function NavbarLink({ className, ...props }: ComponentProps<typeof Link>) {
  return (
    <Link
      className={cn(
        "flex flex-1 flex-col items-center text-sm text-fg *:[svg]:size-8 *:[svg]:rounded-full *:[svg]:p-1.5 data-[status=active]:*:[svg]:bg-brand",
      )}
      {...props}
    />
  );
}
