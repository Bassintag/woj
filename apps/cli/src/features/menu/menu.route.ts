import {
  argument,
  command,
  description,
  name,
  route,
  schema,
} from "@bomb.sh/router";
import {
  CreateMenuSchema,
  IdParamsSchema,
  UpdateMenuSchema,
} from "@woj/contract";
import { defineCommand } from "../../lib/handler";
import { dataArgument } from "../../lib/option";

const idArgument = argument(name("id"), schema(IdParamsSchema.shape.id));

export const menuRoute = route(
  name("menu"),
  description("Manage menus"),
  defineCommand(
    command(name("list"), description("List menus")),
    (_, { client }) => client.menus.list(),
  ),
  defineCommand(
    command(name("get"), description("Get a menu"), idArgument),
    (model, { client }) => client.menus.get(model),
  ),
  defineCommand(
    command(
      name("create"),
      description("Create a menu"),
      dataArgument(CreateMenuSchema),
    ),
    (model, { client }) => client.menus.create(model.data),
  ),
  defineCommand(
    command(
      name("update"),
      description("Update a menu"),
      idArgument,
      dataArgument(UpdateMenuSchema),
    ),
    (model, { client }) => client.menus.update({ id: model.id, ...model.data }),
  ),
  defineCommand(
    command(name("remove"), description("Remove a menu"), idArgument),
    async (model, { client }) => {
      await client.menus.remove(model);
    },
  ),
);
