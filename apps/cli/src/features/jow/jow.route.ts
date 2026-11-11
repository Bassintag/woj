import { command, description, name, route } from "@bomb.sh/router";
import { defineCommand } from "../../lib/handler";
import { importJow } from "./jow.import";

export const jowRoute = route(
  name("jow"),
  description("Jow integration"),
  defineCommand(
    command(
      name("import"),
      description("Import missing units, tags, ingredients and recipes"),
    ),
    (_, context) => importJow(context),
  ),
);
