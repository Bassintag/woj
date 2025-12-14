import { useCartState } from "@/features/cart/hook/useCartState";
import { CartItemDto } from "@/features/cart/domain/Cart";
import { Image } from "@/components/Image";
import { TrashIcon } from "lucide-react";
import { Button } from "@/components/Button";
import { Link } from "react-router-dom";
import { use } from "react";
import { CartContext } from "./CartBanner";

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
  item: CartItemDto;
}

export const CartRecipeListRow = ({ item }: CartRecipeListRowProps) => {
  const remove = useCartState((s) => s.remove);
  const { setIsOpen } = use(CartContext);

  return (
    <li className="flex flex-row items-center gap-1.5">
      <Link
        to={`/recipes/${item.recipe.id}`}
        className="flex flex-row items-center gap-1.5 grow"
        onClick={() => {
          setIsOpen(false);
        }}
      >
        <Image
          className="rounded-xl w-12 h-12 bg-stone-100"
          path={item.recipe.imagePath}
        />
        <div className="grow truncate">
          <div className="text-sm leading-5 truncate">{item.recipe.name}</div>
          <div className="text-sm text-stone-500">x {item.quantity}</div>
        </div>
      </Link>
      <Button
        className="shrink-0"
        colorScheme="white"
        onClick={() => remove(item.recipe)}
      >
        <TrashIcon className="size-6" />
      </Button>
    </li>
  );
};
