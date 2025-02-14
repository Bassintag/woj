import { ShoppingList } from "@/features/shoppingList/domain/ShoppingList";
import { getShoppingListName } from "@/features/recipe/utils/getShoppingListName";
import { Image } from "@/components/Image";
import { Link } from "react-router-dom";
import { XIcon } from "lucide-react";
import { useShoppingListsState } from "@/features/shoppingList/hooks/useShoppingListsState";

export interface ShoppingListListProps {
  shoppingLists: ShoppingList[];
}

export const ShoppingListList = ({ shoppingLists }: ShoppingListListProps) => {
  return (
    <ol>
      {shoppingLists.map((list) => (
        <ShoppingListListRow key={list.id} list={list} />
      ))}
    </ol>
  );
};

export interface ShoppingListListRowProps {
  list: ShoppingList;
}

export const ShoppingListListRow = ({ list }: ShoppingListListRowProps) => {
  const deleteList = useShoppingListsState((s) => s.delete);

  return (
    <li className="py-3 max-sm:even:bg-stone-100 sm:hover:bg-stone-100 transition">
      <div className="container flex flex-row items-center justify-between">
        <Link to={`/shopping-lists/${list.id}`}>
          <div className="container flex flex-col gap-1">
            <div>{getShoppingListName(list)}</div>
            <div className="text-xs text-stone-400">
              {list.items.length} élément(s)
            </div>
            <div className="flex flex-row -space-x-4">
              {list.items
                .filter((item) => item.ingredient != null)
                .map((item) => (
                  <Image
                    className="size-8 rounded-full border-2 bg-white"
                    key={item.id}
                    path={item.ingredient?.imagePath}
                  />
                ))}
            </div>
          </div>
        </Link>
        <button
          className="text-stone-400 active:text-stone-600 transition"
          onClick={() => deleteList(list.id)}
        >
          <XIcon className="size-5" />
        </button>
      </div>
    </li>
  );
};
