import { useShoppingLists } from "@/features/shoppingList/hooks/useShoppingLists";
import { useInfiniteItems } from "@/hooks/useInfiniteItems";
import { ShoppingListList } from "@/features/shoppingList/components/ShoppingListList";
import { PageTitle } from "@/features/recipe/components/PageTitle";

export const ShoppingListsPage = () => {
  const { data } = useShoppingLists();
  const items = useInfiniteItems(data);

  return (
    <div className="py-6 flex flex-col gap-6">
      <div className="container">
        <PageTitle>Recettes</PageTitle>
      </div>
      {items && <ShoppingListList shoppingLists={items} />}
    </div>
  );
};

export const element = <ShoppingListsPage />;
