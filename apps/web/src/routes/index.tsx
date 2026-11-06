import { createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react/jsx-runtime";
import { z } from "zod";
import { Header } from "../components/layout/Header";
import { MenusSection } from "./-components/MenusSection";
import { RecipesSection } from "./-components/RecipesSection";

export const Route = createFileRoute("/")({
  component: RouteComponent,
  validateSearch: z.object({
    q: z.string().nullish(),
    tags: z.array(z.number()).optional(),
  }),
});

function RouteComponent() {
  return (
    <Fragment>
      <Header>Woj</Header>
      <MenusSection />
      <RecipesSection />
    </Fragment>
  );
}
