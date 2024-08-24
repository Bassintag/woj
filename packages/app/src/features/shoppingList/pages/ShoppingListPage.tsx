import { useShoppingList } from "@/features/shoppingList/hooks/useShoppingList";
import { useStringIdParam } from "@/hooks/useIdParam";
import { ShoppingItemList } from "@/features/shoppingList/components/ShoppingItemList";
import { PlusIcon } from "lucide-react";
import { PageTitle } from "@/features/recipe/components/PageTitle";
import { getShoppingListName } from "@/features/recipe/utils/getShoppingListName";
import { RecipeList } from "@/features/recipe/components/RecipeList";
import { useShoppingListsState } from "@/features/shoppingList/hooks/useShoppingListsState";
import { v4 } from "uuid";

export const ShoppingListPage = () => {
  const id = useStringIdParam();
  const shoppingList = useShoppingList(id);
  const createItem = useShoppingListsState((s) => s.createItem);

  return (
    <div className="py-6 flex flex-col gap-6 overflow-hidden">
      <div className="container">
        <PageTitle linkTo="/shopping-lists">
          {shoppingList ? getShoppingListName(shoppingList) : null}
        </PageTitle>
      </div>
      <div className="flex flex-col gap-3">
        {shoppingList && <ShoppingItemList items={shoppingList.items} />}
        <div className="container">
          <button
            onClick={() =>
              createItem(id, { id: v4(), name: "", purchased: false })
            }
            className="flex flex-row items-center gap-3 ml-6 rounded text-stone-500 hover:text-stone-600 active:text-stone-700 transition"
          >
            <PlusIcon className="size-5 ml-0.5" />
            <span>Nouvel élement</span>
          </button>
        </div>
      </div>
      {shoppingList && shoppingList.recipes.length > 0 && (
        <div className="container flex flex-col gap-3">
          <h2 className="text-xl font-medium text-stone-800">Recettes</h2>
          <RecipeList
            backLink={`/shopping-lists/${id}`}
            recipes={shoppingList.recipes}
          />
        </div>
      )}
    </div>
  );
};

export const element = <ShoppingListPage />;
