import { useCartState } from "@/features/cart/hook/useCartState";
import { CartItemBadge } from "@/features/cart/components/CartItemBadge";
import { useMemo } from "react";
import { ChevronLeftIcon, ChevronUpIcon } from "lucide-react";
import { CartRecipeList } from "@/features/cart/components/CartRecipeList";
import { CartIngredientList } from "@/features/cart/components/CartIngredientList";
import * as Dialog from "@radix-ui/react-dialog";
import { SubmitCartButton } from "@/features/cart/components/SubmitCartButton";
import { Drawer, DrawerTitle } from "@/components/Drawer";

export const CartBanner = () => {
  const items = useCartState((c) => c.items);

  const [firstItems, remaining] = useMemo(() => {
    return [items.slice(0, 5), Math.max(0, items.length - 5)];
  }, [items]);

  return (
    <Dialog.Root>
      <Dialog.Trigger className="fixed bottom-0 left-0 right-0 rounded-t-2xl z-20 bg-black text-white">
        <div className="container flex flex-row justify-between items-center h-16">
          <div className="flex flex-row gap-3 items-center">
            <ChevronUpIcon className="size-6" />
            <Dialog.Title className="font-semibold">Panier</Dialog.Title>
            {items.length > 0 && (
              <span className="rounded-full bg-white text-black text-xs font-semibold px-2">
                {items.length}
              </span>
            )}
          </div>
          <div className="flex flex-row -space-x-4">
            {items.length === 0 && (
              <p className="italic text-stone-500 text-sm">Panier vide</p>
            )}
            {firstItems.map((item) => (
              <CartItemBadge key={item.recipe.id} carItem={item} />
            ))}
            {remaining > 0 && (
              <div className="w-8 h-8 text-xs border-black border-2 flex items-center justify-center rounded-full bg-stone-500">
                +{remaining}
              </div>
            )}
          </div>
        </div>
      </Dialog.Trigger>
      <Drawer className="container flex flex-col gap-6">
        <DrawerTitle>Panier</DrawerTitle>
        <section className="flex flex-col gap-1.5">
          <h3 className="text-lg text-stone-400">Recettes</h3>
          <CartRecipeList />
        </section>
        <section className="flex flex-col gap-1.5">
          <h3 className="text-lg text-stone-400">Ingrédients</h3>
          <CartIngredientList />
        </section>
        <SubmitCartButton />
      </Drawer>
    </Dialog.Root>
  );
};
