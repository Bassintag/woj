import { CartItem } from "@/features/cart/domain/Cart";
import { Image } from "@/components/Image";

export interface CartItemBadgeProps {
  carItem: CartItem;
}

export const CartItemBadge = ({ carItem }: CartItemBadgeProps) => {
  return (
    <Image
      path={carItem.recipe.imagePath}
      className="w-8 h-8 rounded-full bg-white border-black border-2"
    />
  );
};
