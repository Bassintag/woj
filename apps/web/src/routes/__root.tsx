import { createRootRoute, Outlet, useMatches } from "@tanstack/react-router";
import { Navbar } from "../components/layout/Navbar";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  const hideNavbar = useMatches({
    select: (matches) => matches.some((match) => match.staticData.hideNavbar),
  });

  return (
    <div className="flex min-h-dvh flex-col gap-8 bg-bg pt-8">
      <Outlet />
      {!hideNavbar && <Navbar />}
    </div>
  );
}
