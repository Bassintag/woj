import { createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react";
import { CartButton } from "@/components/cart/CartButton";
import { Header } from "@/components/layout/Header";
import { useFavoritesStore } from "@/hooks/useFavoritesStore";
import {
  RecipesSection,
  recipeSearchSchema,
} from "../-components/RecipesSection";

export const Route = createFileRoute("/favorites/")({
  component: RouteComponent,
  validateSearch: recipeSearchSchema,
});

function RouteComponent() {
  const ids = useFavoritesStore((state) => state.ids);

  return (
    <Fragment>
      <Header>
        Favoris
        <CartButton />
      </Header>
      <RecipesSection ids={ids} />
    </Fragment>
  );
}
