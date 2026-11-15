import { Toast } from "@base-ui/react/toast";
import { XIcon } from "@phosphor-icons/react";
import type { PropsWithChildren } from "react";
import { Button } from "./Button";

export const toastManager = Toast.createToastManager();

function ToastList() {
  const { toasts } = Toast.useToastManager();

  return (
    <Toast.Portal>
      <Toast.Viewport className="fixed inset-x-0 top-0 z-50 flex flex-col gap-2 px-layout pt-4">
        {toasts.map((toast) => (
          <Toast.Root
            key={toast.id}
            toast={toast}
            className="flex flex-row items-start gap-4 rounded-2xl bg-surface p-4 text-fg shadow-base transition-[opacity,translate] duration-300 data-ending-style:-translate-y-full data-ending-style:opacity-0 data-starting-style:-translate-y-full data-starting-style:opacity-0 motion-reduce:transition-none"
          >
            <Toast.Content className="flex min-w-0 flex-1 flex-col gap-1">
              <Toast.Title
                className={
                  toast.type === "error"
                    ? "text-md text-error"
                    : "text-md text-fg"
                }
              />
              <Toast.Description className="text-sm text-muted" />
            </Toast.Content>
            <Toast.Close render={<Button size="sm" aria-label="Fermer" />}>
              <XIcon />
            </Toast.Close>
          </Toast.Root>
        ))}
      </Toast.Viewport>
    </Toast.Portal>
  );
}

export function ToastProvider({ children }: PropsWithChildren) {
  return (
    <Toast.Provider toastManager={toastManager}>
      {children}
      <ToastList />
    </Toast.Provider>
  );
}
