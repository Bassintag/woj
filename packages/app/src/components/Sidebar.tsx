import * as Dialog from "@radix-ui/react-dialog";
import {
  CookieIcon,
  CookingPotIcon,
  LucideIcon,
  MenuIcon,
  ShoppingBasketIcon,
  XIcon,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import { createContext, useContext, useState } from "react";

interface SidebarContextValue {
  open: boolean;
  setOpen: (value: boolean) => void;
}

const SidebarContext = createContext<SidebarContextValue | null>(null);

const useSidebarContext = () =>
  useContext(SidebarContext) as SidebarContextValue;

export const Sidebar = () => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger>
        <MenuIcon className="size-6" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed z-20 inset-0 bg-black/50" />
        <Dialog.Content className="fixed z-20 left-0 top-0 bottom-0 w-72 flex flex-col py-12 bg-white animate-in slide-in-from-left">
          <Dialog.Title className="sr-only">Menu</Dialog.Title>
          <Dialog.Close>
            <XIcon className="size-6 absolute top-3 right-6" />
          </Dialog.Close>
          <SidebarContext.Provider value={{ open, setOpen }}>
            <SidebarLink to="/" icon={CookingPotIcon} label="Recettes" />
            <SidebarLink
              to="/shopping-lists"
              icon={ShoppingBasketIcon}
              label="Listes de courses"
            />
          </SidebarContext.Provider>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export interface SidebarLinkProps {
  to: string;
  icon: LucideIcon;
  label: string;
}

export const SidebarLink = ({ to, icon: Icon, label }: SidebarLinkProps) => {
  const { setOpen } = useSidebarContext();
  return (
    <NavLink
      className={
        "flex flex-row gap-3 py-3 px-6 hover:bg-stone-100 active:bg-stone-200 aria-current-page:bg-stone-100 transition"
      }
      to={to}
      onClick={() => setOpen(false)}
    >
      <Icon />
      <span>{label}</span>
    </NavLink>
  );
};
