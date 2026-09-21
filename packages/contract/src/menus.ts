import { oc } from "@orpc/contract";
import { openapi } from "@orpc/openapi";
import { z } from "zod";
import { RecipeSchema } from "./recipes";

// Schemas

export const MenuSchema = z.object({
  id: z.number(),
  title: z.string(),
  meals: z.array(z.object({ serving: z.number(), recipe: RecipeSchema })),
});

export type Menu = z.infer<typeof MenuSchema>;

// Contract

const list = oc
  .meta(openapi({ method: "GET", path: "/" }))
  .output(z.array(MenuSchema));

const create = oc
  .meta(openapi({ method: "POST", path: "/" }))
  .input(MenuSchema.omit({ id: true }))
  .output(MenuSchema);

const update = oc
  .meta(openapi({ method: "PATCH", path: "/{id}" }))
  .input(MenuSchema.omit({ id: true }))
  .output(MenuSchema);

const remove = oc.meta(openapi({ method: "DELETE", path: "/{id}" }));

export const menusContract = oc.meta(openapi({ prefix: "/menus" })).router({
  list,
  create,
  update,
  remove,
});
