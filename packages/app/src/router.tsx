import { createBrowserRouter, Navigate } from "react-router-dom";

export const router = createBrowserRouter([
  {
    lazy: () => import("./features/cart/pages/CartPage"),
    children: [
      {
        path: "recipes",
        children: [
          {
            index: true,
            lazy: () => import("./features/recipe/pages/RecipesPage"),
          },
          {
            path: ":id",
            lazy: () => import("./features/recipe/pages/RecipePage"),
          },
        ],
      },
      {
        path: "shopping-lists",
        children: [
          {
            index: true,
            lazy: () =>
              import("./features/shoppingList/pages/ShoppingListsPage"),
          },
          {
            path: ":id",
            lazy: () =>
              import("./features/shoppingList/pages/ShoppingListPage"),
          },
        ],
      },
      {
        path: "menu",
        index: true,
        lazy: () => import("./features/menu/pages/MenuPage"),
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/recipes" replace />,
  },
]);
