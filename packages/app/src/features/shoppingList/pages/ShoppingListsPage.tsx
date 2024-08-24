import { ShoppingListList } from "@/features/shoppingList/components/ShoppingListList";
import { PageTitle } from "@/features/recipe/components/PageTitle";
import { useShoppingListsState } from "@/features/shoppingList/hooks/useShoppingListsState";
import { Placeholder } from "@/components/Placeholder";
import { ShoppingBasketIcon } from "lucide-react";

export const ShoppingListsPage = () => {
  const shoppingLists = useShoppingListsState((s) => s.shoppingLists);

  return (
    <div className="py-6 flex flex-col gap-6">
      <div className="container">
        <PageTitle>Listes de courses</PageTitle>
      </div>
      {shoppingLists.length > 0 ? (
        <ShoppingListList shoppingLists={shoppingLists} />
      ) : (
        <Placeholder
          label="Créez des listes de courses en ajoutant des recettes à votre panier"
          icon={ShoppingBasketIcon}
        />
      )}
    </div>
  );
};

export const element = <ShoppingListsPage />;
