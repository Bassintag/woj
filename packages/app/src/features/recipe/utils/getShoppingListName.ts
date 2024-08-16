import { ShoppingList } from "@/features/shoppingList/domain/ShoppingList";
import { format } from "date-fns";
import { fr } from "date-fns/locale/fr";

export const getShoppingListName = ({ createdAt }: ShoppingList) => {
  const datePart = format(createdAt, "EEEE do MMMM yyyy", {
    locale: fr,
  });
  return `Liste du ${datePart}`;
};
