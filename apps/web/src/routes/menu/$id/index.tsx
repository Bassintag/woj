import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/menu/$id/")({
  component: RouteComponent,
  params: z.object({
    id: z.coerce.number(),
  }),
});

function RouteComponent() {
  return <div>Hello "/menu/$id/"!</div>;
}
