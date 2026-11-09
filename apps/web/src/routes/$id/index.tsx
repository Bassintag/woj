import { CaretLeftIcon } from "@phosphor-icons/react";
import { createFileRoute, Link, useSearch } from "@tanstack/react-router";
import { Fragment } from "react";
import { z } from "zod";
import { CartButton } from "@/components/cart/CartButton";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { DetailsSection } from "./-components/DetailsSection";
import { IngredientsSections } from "./-components/IngredientsSection";
import { RecipeActions } from "./-components/RecipeActions";
import { StepsSection } from "./-components/StepsSection";

export const Route = createFileRoute("/$id/")({
  component: RouteComponent,
  staticData: { hideNavbar: true },
  validateSearch: z.object({ from: z.enum(["favorites"]).optional() }),
  params: z.object({
    id: z.coerce.number(),
  }),
});

function RouteComponent() {
  const from = useSearch({ from: "/$id/", select: (s) => s.from });

  return (
    <Fragment>
      <Header>
        <Button
          size="md"
          render={<Link to={from === "favorites" ? "/favorites" : "/"} />}
        >
          <CaretLeftIcon />
        </Button>
        <CartButton />
      </Header>
      <DetailsSection />
      <IngredientsSections />
      <StepsSection />
      <RecipeActions />
    </Fragment>
  );
}
