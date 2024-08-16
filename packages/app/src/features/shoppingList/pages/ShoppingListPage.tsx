import { useShoppingList } from "@/features/shoppingList/hooks/useShoppingList";
import { useIdParam } from "@/hooks/useIdParam";
import { ShoppingItemList } from "@/features/shoppingList/components/ShoppingItemList";
import { useCreateShoppingItem } from "@/features/shoppingList/hooks/useCreateShoppingItem";
import { PlusIcon } from "lucide-react";
import { PageTitle } from "@/features/recipe/components/PageTitle";
import { getShoppingListName } from "@/features/recipe/utils/getShoppingListName";

export const ShoppingListPage = () => {
  const id = useIdParam();
  const { data: shoppingList } = useShoppingList(id);
  const { mutate: createItem } = useCreateShoppingItem();

  return (
    <div className="py-6 flex flex-col gap-3 overflow-hidden">
      <div className="container">
        <PageTitle linkTo="/shopping-lists">
          {shoppingList ? getShoppingListName(shoppingList) : null}
        </PageTitle>
      </div>
      {shoppingList && <ShoppingItemList items={shoppingList.items} />}
      <div className="container">
        <button
          onClick={() =>
            createItem({ shoppingListId: id, name: "", purchased: false })
          }
          className="flex flex-row items-center gap-3 ml-6 rounded text-stone-500 hover:text-stone-600 active:text-stone-700 transition"
        >
          <PlusIcon className="size-5 ml-0.5" />
          <span>Nouvel élement</span>
        </button>
      </div>
    </div>
  );
};

export const element = <ShoppingListPage />;
