import { useShoppingList } from "@/features/shoppingList/hooks/useShoppingList";
import { useIdParam } from "@/hooks/useIdParam";
import { ShoppingItemList } from "@/features/shoppingList/components/ShoppingItemList";
import { useCreateShoppingItem } from "@/features/shoppingList/hooks/useCreateShoppingItem";
import { PlusIcon } from "lucide-react";
import { PageTitle } from "@/features/recipe/components/PageTitle";
import { getShoppingListName } from "@/features/recipe/utils/getShoppingListName";
import { RecipeList } from "@/features/recipe/components/RecipeList";

export const ShoppingListPage = () => {
  const id = useIdParam();
  const { data: shoppingList } = useShoppingList(id);
  const { mutate: createItem } = useCreateShoppingItem();

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
              createItem({ shoppingListId: id, name: "", purchased: false })
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
