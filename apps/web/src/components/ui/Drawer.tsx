import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import { cn } from "@/lib/cn";

export const Drawer = BaseDrawer.Root;

export const DrawerTrigger = BaseDrawer.Trigger;

export const DrawerClose = BaseDrawer.Close;

export function DrawerContent({ className, ...props }: BaseDrawer.Popup.Props) {
  return (
    <BaseDrawer.Portal>
      <BaseDrawer.Backdrop className="fixed inset-0 bg-fg/40 transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
      <BaseDrawer.Viewport className="fixed inset-0 flex items-end justify-center">
        <BaseDrawer.Popup
          className={cn(
            "flex max-h-128 w-full translate-y-(--drawer-swipe-movement-y) flex-col gap-8 overflow-hidden rounded-t-4xl bg-elevated-bg p-8 text-elevated-fg transition-transform duration-300 data-ending-style:translate-y-full data-starting-style:translate-y-full motion-reduce:transition-none",
            className,
          )}
          {...props}
        />
      </BaseDrawer.Viewport>
    </BaseDrawer.Portal>
  );
}

export function DrawerTitle({ className, ...props }: BaseDrawer.Title.Props) {
  return (
    <BaseDrawer.Title className={cn("text-h1 text-fg", className)} {...props} />
  );
}

export function DrawerDescription({
  className,
  ...props
}: BaseDrawer.Description.Props) {
  return (
    <BaseDrawer.Description
      className={cn("text-md text-muted-fg", className)}
      {...props}
    />
  );
}
