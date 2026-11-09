import { BasketIcon } from "@phosphor-icons/react";
import type { ComponentProps } from "react";
import { Button } from "@/components/ui/Button";
import { Drawer, DrawerTrigger } from "@/components/ui/Drawer";
import { useCartStore } from "@/hooks/useCartStore";
import { CartDrawer } from "./CartDrawer";

export function CartButton(props: ComponentProps<typeof Drawer>) {
  const count = useCartStore((state) => state.items.length);

  return (
    <Drawer {...props}>
      <DrawerTrigger
        render={
          <Button
            className="ml-auto"
            size="sm"
            variant="brand"
            aria-label="Panier"
          />
        }
      >
        <BasketIcon />
        {count}
      </DrawerTrigger>
      <CartDrawer />
    </Drawer>
  );
}
