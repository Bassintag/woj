import {
  argument,
  command,
  description,
  name,
  route,
  schema,
} from "@bomb.sh/router";
import {
  CreateIngredientSchema,
  IdParamsSchema,
  UpdateIngredientSchema,
} from "@woj/contract";
import { defineCommand } from "../../lib/handler";
import { dataArgument } from "../../lib/option";

const idArgument = argument(name("id"), schema(IdParamsSchema.shape.id));

export const ingredientRoute = route(
  name("ingredient"),
  description("Manage ingredients"),
  defineCommand(
    command(name("list"), description("List ingredients")),
    (_, { client }) => client.ingredients.list(),
  ),
  defineCommand(
    command(name("get"), description("Get an ingredient"), idArgument),
    (model, { client }) => client.ingredients.get(model),
  ),
  defineCommand(
    command(
      name("create"),
      description("Create an ingredient"),
      dataArgument(CreateIngredientSchema),
    ),
    (model, { client }) => client.ingredients.create(model.data),
  ),
  defineCommand(
    command(
      name("update"),
      description("Update an ingredient"),
      idArgument,
      dataArgument(UpdateIngredientSchema),
    ),
    (model, { client }) =>
      client.ingredients.update({ id: model.id, ...model.data }),
  ),
  defineCommand(
    command(name("remove"), description("Remove an ingredient"), idArgument),
    async (model, { client }) => {
      await client.ingredients.remove(model);
    },
  ),
);
