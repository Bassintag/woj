import { oc } from "@orpc/contract";
import { openapi } from "@orpc/openapi";
import { z } from "zod";
import { auth } from "./lib/auth";
import {
  IdParamsSchema,
  IdSchema,
  PatchSchema,
  TextSchema,
} from "./lib/shared";
import { RecipeSchema } from "./recipe";

// Schemas

export const MealSchema = z.object({
  id: z.number(),
  quantity: z.number(),
  recipe: RecipeSchema,
});

export const MenuSchema = z.object({
  id: z.number(),
  title: z.string(),
  meals: z.array(MealSchema),
});

export type Menu = z.infer<typeof MenuSchema>;

export const CreateMenuSchema = z.object({
  title: TextSchema(128),
  meals: z.array(
    z.object({ recipeId: IdSchema, quantity: z.number().int().positive() }),
  ),
});

export type CreateMenu = z.infer<typeof CreateMenuSchema>;

export const UpdateMenuSchema = PatchSchema(CreateMenuSchema.shape);

export type UpdateMenu = z.infer<typeof UpdateMenuSchema>;

// Contract

const list = oc
  .meta(openapi({ method: "GET", path: "/" }))
  .meta(auth(false))
  .output(z.array(MenuSchema));

const get = oc
  .meta(openapi({ method: "GET", path: "/{id}" }))
  .meta(auth(false))
  .input(IdParamsSchema)
  .output(MenuSchema);

const create = oc
  .meta(openapi({ method: "POST", path: "/" }))
  .input(CreateMenuSchema)
  .output(MenuSchema);

const update = oc
  .meta(openapi({ method: "PATCH", path: "/{id}" }))
  .input(UpdateMenuSchema)
  .output(MenuSchema);

const remove = oc
  .meta(openapi({ method: "DELETE", path: "/{id}" }))
  .input(IdParamsSchema);

export const menusContract = oc.meta(openapi({ prefix: "/menus" })).router({
  list,
  get,
  create,
  update,
  remove,
});
