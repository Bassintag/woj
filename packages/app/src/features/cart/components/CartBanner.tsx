import { useCartState } from "@/features/cart/hook/useCartState";
import { CartItemBadge } from "@/features/cart/components/CartItemBadge";
import { useMemo } from "react";
import { ChevronLeftIcon, ChevronUpIcon } from "lucide-react";
import { CartRecipeList } from "@/features/cart/components/CartRecipeList";
import { CartIngredientList } from "@/features/cart/components/CartIngredientList";
import * as Dialog from "@radix-ui/react-dialog";
import { SubmitCartButton } from "@/features/cart/components/SubmitCartButton";

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
      <Dialog.Portal>
        <Dialog.Overlay
          className={
            "fixed inset-0 backdrop-blur-sm bg-black/50 z-20 duration-300 data-[state=open]:animate-in data-[state=open]:fade-in data-[state=closed]:animate-out data-[state=closed]:fade-out"
          }
        />
        <Dialog.Content className="fixed inset-0 top-32 z-20 rounded-t-2xl bg-white mt-3 data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom data-[state=closed]:animate-out data-[state=closed]:slide-out-to-bottom overflow-y-auto pt-6 pb-3">
          <div className="container min-h-full flex flex-col gap-6">
            <div className="flex flex-row items-center gap-1.5">
              <Dialog.Close>
                <ChevronLeftIcon className="size-6" />
              </Dialog.Close>
              <h2 className="text-2xl font-medium text-stone-800">Panier</h2>
            </div>
            <section className="flex flex-col gap-1.5">
              <h3 className="text-lg text-stone-400">Recettes</h3>
              <CartRecipeList />
            </section>
            <section className="flex flex-col gap-1.5">
              <h3 className="text-lg text-stone-400">Ingrédients</h3>
              <CartIngredientList />
            </section>
            <SubmitCartButton />
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
