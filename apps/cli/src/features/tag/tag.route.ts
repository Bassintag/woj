import {
  argument,
  command,
  description,
  name,
  route,
  schema,
} from "@bomb.sh/router";
import {
  CreateTagSchema,
  IdParamsSchema,
  UpdateTagSchema,
} from "@woj/contract";
import { defineCommand } from "../../lib/handler";
import { dataArgument } from "../../lib/option";

const idArgument = argument(name("id"), schema(IdParamsSchema.shape.id));

export const tagRoute = route(
  name("tag"),
  description("Manage tags"),
  defineCommand(
    command(name("list"), description("List tags")),
    (_, { client }) => client.tags.list(),
  ),
  defineCommand(
    command(name("get"), description("Get a tag"), idArgument),
    (model, { client }) => client.tags.get(model),
  ),
  defineCommand(
    command(
      name("create"),
      description("Create a tag"),
      dataArgument(CreateTagSchema),
    ),
    (model, { client }) => client.tags.create(model.data),
  ),
  defineCommand(
    command(
      name("update"),
      description("Update a tag"),
      idArgument,
      dataArgument(UpdateTagSchema),
    ),
    (model, { client }) => client.tags.update({ id: model.id, ...model.data }),
  ),
  defineCommand(
    command(name("remove"), description("Remove a tag"), idArgument),
    async (model, { client }) => {
      await client.tags.remove(model);
    },
  ),
);
