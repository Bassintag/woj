import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Navbar } from "../components/layout/Navbar";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <div className="flex min-h-dvh flex-col gap-8 bg-bg pt-8">
      <Outlet />
      <Navbar />
    </div>
  );
}
