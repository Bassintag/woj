import * as Dialog from "@radix-ui/react-dialog";
import { DialogContentProps } from "@radix-ui/react-dialog";
import { ChevronLeftIcon } from "lucide-react";
import classNames from "classnames";
import { PropsWithChildren } from "react";

export interface DrawerProps extends DialogContentProps {}

export const Drawer = ({ className, children, ...rest }: DrawerProps) => {
  return (
    <Dialog.Portal>
      <Dialog.Overlay
        className={
          "fixed inset-0 backdrop-blur-sm bg-black/50 z-20 duration-300 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out"
        }
      />
      <Dialog.Content
        className={classNames(
          "fixed inset-0 top-32 z-20 rounded-t-2xl pt-6 pb-3 bg-white mt-3 data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom overflow-y-auto",
          className,
        )}
        {...rest}
      >
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
};

export interface DrawerTitleProps extends PropsWithChildren {}

export const DrawerTitle = ({ children }: DrawerTitleProps) => {
  return (
    <div className="flex flex-row items-center gap-1.5">
      <Dialog.Close>
        <ChevronLeftIcon className="size-6" />
      </Dialog.Close>
      <Dialog.Title className="text-2xl font-medium text-stone-800">
        {children}
      </Dialog.Title>
    </div>
  );
};
