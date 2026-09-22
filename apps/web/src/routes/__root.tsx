import { BasketIcon, NotepadIcon } from "@phosphor-icons/react";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { Fragment } from "react";
import { Button } from "@/components/ui/Button";

export const Route = createRootRoute({
  component: RootComponent,
});

function RootComponent() {
  return (
    <Fragment>
      <div className="flex flex-row justify-end gap-4">
        <Button aria-label="Panier">
          <BasketIcon />
        </Button>
        <Button variant="ghost">
          <NotepadIcon />
        </Button>
      </div>
      <Outlet />
    </Fragment>
  );
}
