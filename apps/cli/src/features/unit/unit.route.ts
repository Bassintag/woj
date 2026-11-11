import {
  argument,
  command,
  description,
  name,
  route,
  schema,
} from "@bomb.sh/router";
import {
  CreateUnitSchema,
  IdParamsSchema,
  UpdateUnitSchema,
} from "@woj/contract";
import { defineCommand } from "../../lib/handler";
import { dataArgument } from "../../lib/option";

const idArgument = argument(name("id"), schema(IdParamsSchema.shape.id));

export const unitRoute = route(
  name("unit"),
  description("Manage units"),
  defineCommand(
    command(name("list"), description("List units")),
    (_, { client }) => client.units.list(),
  ),
  defineCommand(
    command(name("get"), description("Get a unit"), idArgument),
    (model, { client }) => client.units.get(model),
  ),
  defineCommand(
    command(
      name("create"),
      description("Create a unit"),
      dataArgument(CreateUnitSchema),
    ),
    (model, { client }) => client.units.create(model.data),
  ),
  defineCommand(
    command(
      name("update"),
      description("Update a unit"),
      idArgument,
      dataArgument(UpdateUnitSchema),
    ),
    (model, { client }) => client.units.update({ id: model.id, ...model.data }),
  ),
  defineCommand(
    command(name("remove"), description("Remove a unit"), idArgument),
    async (model, { client }) => {
      await client.units.remove(model);
    },
  ),
);
