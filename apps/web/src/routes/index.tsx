import { createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";
import { CartButton } from "../components/cart/CartButton";
import { Header } from "../components/layout/Header";
import { MenusSection } from "./-components/MenusSection";
import {
  RecipesSection,
  recipeSearchSchema,
} from "./-components/RecipesSection";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  validateSearch: recipeSearchSchema,
});

function RouteComponent() {
  return (
    <Fragment>
      <title>WOJ</title>
      <Header>
        Woj
        <CartButton />
      </Header>
      <MenusSection />
      <RecipesSection title="Recettes" />
    </Fragment>
  );
}
