import { TrashIcon } from "@phosphor-icons/react";
import { type ReactNode, useState } from "react";
import { Button } from "@/components/ui/Button";
import {
  Drawer,
  DrawerActions,
  DrawerClose,
  DrawerDescription,
  DrawerHeader,
  DrawerPopup,
  DrawerTitle,
} from "@/components/ui/Drawer";

export function ConfirmDrawer({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: ReactNode;
  description: ReactNode;
  onConfirm: () => Promise<unknown>;
}) {
  const [pending, setPending] = useState(false);

  async function confirm() {
    setPending(true);
    try {
      await onConfirm();
    } finally {
      setPending(false);
    }
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerPopup>
        <DrawerHeader>
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <DrawerActions>
          <Button variant="brand" disabled={pending} onClick={confirm}>
            <TrashIcon />
            Supprimer
          </Button>
          <DrawerClose render={<Button variant="ghost" />}>Annuler</DrawerClose>
        </DrawerActions>
      </DrawerPopup>
    </Drawer>
  );
}
