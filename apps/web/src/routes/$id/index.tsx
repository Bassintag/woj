import { CaretLeftIcon } from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment } from "react";
import { z } from "zod";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { DetailsSection } from "./-components/DetailsSection";
import { IngredientsSections } from "./-components/IngredientsSection";
import { StepsSection } from "./-components/StepsSection";

export const Route = createFileRoute("/$id/")({
  component: RouteComponent,
  params: z.object({
    id: z.coerce.number(),
  }),
});

function RouteComponent() {
  return (
    <Fragment>
      <Header>
        <Button size="md" render={<Link to="/" />}>
          <CaretLeftIcon />
        </Button>
      </Header>
      <DetailsSection />
      <IngredientsSections />
      <StepsSection />
    </Fragment>
  );
}
