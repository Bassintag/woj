import { argument, description, name, schema } from "@bomb.sh/router";
import { z } from "zod";

type JsonSchema = z.core.JSONSchema.BaseSchema;

function jsonOption<T extends z.ZodType>(bodySchema: T) {
  return z
    .string()
    .transform((value, ctx) => {
      try {
        return JSON.parse(value) as unknown;
      } catch {
        ctx.issues.push({
          code: "custom",
          message: "Invalid JSON",
          input: value,
        });
        return z.NEVER;
      }
    })
    .pipe(bodySchema);
}

function signature(node: JsonSchema): string {
  if (node.enum)
    return node.enum.map((value) => JSON.stringify(value)).join(" | ");
  const variants = node.anyOf ?? node.oneOf;
  if (variants) return variants.map(signature).join(" | ");
  if (node.type === "array") return `${signature(node.items as JsonSchema)}[]`;
  if (node.type === "object") {
    const required = new Set(node.required);
    const fields = Object.entries(node.properties ?? {}).map(
      ([key, value]) =>
        `${key}${required.has(key) ? "" : "?"}: ${signature(value as JsonSchema)}`,
    );
    return `{ ${fields.join(", ")} }`;
  }
  return [node.type].flat().join(" | ");
}

export function dataArgument<T extends z.ZodType>(bodySchema: T) {
  const shape = signature(z.toJSONSchema(bodySchema, { io: "input" }));
  return argument(
    name("data"),
    description(`JSON body ${shape}}`),
    schema(jsonOption(bodySchema)),
  );
}
