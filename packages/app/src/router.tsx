import { createBrowserRouter, Navigate } from "react-router-dom";

export const router = createBrowserRouter([
  {
    index: true,
    lazy: () => import("./features/recipe/pages/RecipesPage"),
  },
  {
    path: ":id",
    lazy: () => import("./features/recipe/pages/RecipePage"),
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);
