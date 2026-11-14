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
import { RecipeSchema } from "./recipe.contract";

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

export const UpdateMenuSchema = CreateMenuSchema.partial();

export type UpdateMenu = z.infer<typeof UpdateMenuSchema>;

// Contract

const list = oc
  .meta(
    openapi({
      method: "GET",
      path: "/",
      summary: "List menus",
      description: "Returns all menus. Does not require authentication.",
    }),
  )
  .meta(auth(false))
  .output(z.array(MenuSchema));

const get = oc
  .meta(
    openapi({
      method: "GET",
      path: "/{id}",
      summary: "Get a menu",
      description:
        "Returns a menu with its meals. Does not require authentication.",
    }),
  )
  .meta(auth(false))
  .input(IdParamsSchema)
  .output(MenuSchema);

const create = oc
  .meta(
    openapi({
      method: "POST",
      path: "/",
      summary: "Create a menu",
      description: "Creates and returns a menu with its meals.",
    }),
  )
  .input(CreateMenuSchema)
  .output(MenuSchema);

const update = oc
  .meta(
    openapi({
      method: "PATCH",
      path: "/{id}",
      summary: "Update a menu",
      description:
        "Updates only the provided fields of a menu and returns a menu with its meals.",
    }),
  )
  .input(PatchSchema(UpdateMenuSchema))
  .output(MenuSchema);

const remove = oc
  .meta(
    openapi({
      method: "DELETE",
      path: "/{id}",
      summary: "Delete a menu",
      description: "Permanently deletes a menu.",
    }),
  )
  .input(IdParamsSchema);

export const menusContract = oc
  .meta(openapi({ prefix: "/menus", tags: ["Menus"] }))
  .router({
    list,
    get,
    create,
    update,
    remove,
  });
