import { createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";
import { DrawerTrigger } from "@/components/ui/Drawer";
import { CartButton } from "../components/cart/CartButton";
import { Header } from "../components/layout/Header";
import { pageTitle } from "../lib/pageTitle";
import { LoginFormDrawer } from "./-components/LoginFormDrawer";
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
      <title>{pageTitle()}</title>
      <Header>
        <LoginFormDrawer>
          <DrawerTrigger>Woj</DrawerTrigger>
        </LoginFormDrawer>
        <CartButton />
      </Header>
      <MenusSection />
      <RecipesSection title="Recettes" />
    </Fragment>
  );
}
