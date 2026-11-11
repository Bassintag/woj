import {
  argument,
  command,
  description,
  multiple,
  name,
  option,
  route,
  schema,
} from "@bomb.sh/router";
import {
  CreateRecipeSchema,
  IdParamsSchema,
  UpdateRecipeSchema,
} from "@woj/contract";
import { z } from "zod";
import { defineCommand } from "../../lib/handler";
import { dataArgument } from "../../lib/option";
import { searchRecipes } from "./recipe.search";

const idArgument = argument(name("id"), schema(IdParamsSchema.shape.id));

export const recipeRoute = route(
  name("recipe"),
  description("Manage recipes"),
  defineCommand(
    command(
      name("list"),
      description("List recipes"),
      option(
        name("search"),
        description("Fuzzy search on title and ingredients"),
        schema(z.string().optional()),
      ),
      option(
        name("tag"),
        description("Only recipes having this tag id (repeat for several)"),
        multiple(),
        schema(z.array(z.coerce.number().int()).default([])),
      ),
      option(
        name("limit"),
        description("Maximum number of recipes"),
        schema(z.coerce.number().int().positive().optional()),
      ),
    ),
    async ({ search, tag, limit }, { client }) => {
      const all = await client.recipes.list();
      const found = search ? searchRecipes(all, search) : all;
      return found
        .filter((recipe) =>
          tag.every((id) => recipe.tagIds.some((tId) => tId === id)),
        )
        .slice(0, limit);
    },
  ),
  defineCommand(
    command(name("get"), description("Get a recipe"), idArgument),
    (model, { client }) => client.recipes.get(model),
  ),
  defineCommand(
    command(
      name("create"),
      description("Create a recipe"),
      dataArgument(CreateRecipeSchema),
    ),
    (model, { client }) => client.recipes.create(model.data),
  ),
  defineCommand(
    command(
      name("update"),
      description("Update a recipe"),
      idArgument,
      dataArgument(UpdateRecipeSchema),
    ),
    (model, { client }) =>
      client.recipes.update({ id: model.id, ...model.data }),
  ),
  defineCommand(
    command(name("remove"), description("Remove a recipe"), idArgument),
    async (model, { client }) => {
      await client.recipes.remove(model);
    },
  ),
);
