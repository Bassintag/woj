import { mergeProps, useRender } from "@base-ui/react";
import { Drawer as BaseDrawer } from "@base-ui/react/drawer";
import type { ComponentProps } from "react";
import { cn } from "@/lib/cn";

export const Drawer = BaseDrawer.Root;

export const DrawerTrigger = BaseDrawer.Trigger;

export const DrawerClose = BaseDrawer.Close;

export function DrawerPopup({
  className,
  children,
  ...props
}: BaseDrawer.Popup.Props) {
  return (
    <BaseDrawer.Portal>
      <BaseDrawer.Backdrop className="fixed inset-0 bg-fg/60 transition-opacity duration-300 data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none" />
      <BaseDrawer.Viewport className="fixed inset-0 flex items-end justify-center">
        <BaseDrawer.Popup
          className={cn(
            "relative flex max-h-[80dvh] w-full translate-y-(--drawer-swipe-movement-y) flex-col overflow-hidden rounded-t-4xl bg-bg py-3 text-fg transition-transform duration-300 data-ending-style:translate-y-full data-starting-style:translate-y-full motion-reduce:transition-none",
            className,
          )}
          {...props}
        >
          {children}
        </BaseDrawer.Popup>
      </BaseDrawer.Viewport>
    </BaseDrawer.Portal>
  );
}

export function DrawerHeader({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-1 px-layout py-3", className)}
      {...props}
    />
  );
}

export function DrawerContent({
  render,
  className,
  ...props
}: useRender.ComponentProps<"div">) {
  return useRender({
    defaultTagName: "div",
    render,
    props: mergeProps(
      { className: cn("flex-1 overflow-y-auto px-layout py-3", className) },
      props,
    ),
  });
}

export function DrawerActions({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-4 px-layout py-3", className)}
      {...props}
    />
  );
}

export function DrawerTitle({ className, ...props }: BaseDrawer.Title.Props) {
  return (
    <BaseDrawer.Title
      className={cn("font-display text-h1 text-fg", className)}
      {...props}
    />
  );
}

export function DrawerDescription({
  className,
  ...props
}: BaseDrawer.Description.Props) {
  return (
    <BaseDrawer.Description
      className={cn("text-md text-muted", className)}
      {...props}
    />
  );
}
