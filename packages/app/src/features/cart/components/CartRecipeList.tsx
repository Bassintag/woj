import { useCartState } from "@/features/cart/hook/useCartState";
import { CartItem } from "@/features/cart/domain/Cart";
import { Image } from "@/components/Image";
import { MinusIcon, PlusIcon, TrashIcon, XIcon } from "lucide-react";
import { Button } from "@/components/Button";

export const CartRecipeList = () => {
  const items = useCartState((s) => s.items);

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => (
        <CartRecipeListRow key={item.recipe.id} item={item} />
      ))}
    </ul>
  );
};

export interface CartRecipeListRowProps {
  item: CartItem;
}

export const CartRecipeListRow = ({ item }: CartRecipeListRowProps) => {
  const [add, remove] = useCartState((s) => [s.add, s.remove]);

  return (
    <li className="flex flex-row items-center gap-1.5">
      <Image
        className="rounded-xl w-12 h-12 bg-stone-100"
        path={item.recipe.imagePath}
      />
      <div className="grow truncate">
        <div className="text-sm leading-3 truncate">{item.recipe.name}</div>
        <div className="text-sm text-stone-500">x {item.quantity}</div>
      </div>
      <Button
        className="shrink-0"
        variant="icon"
        onClick={() => remove(item.recipe)}
      >
        <TrashIcon className="size-6" />
      </Button>
    </li>
  );
};
