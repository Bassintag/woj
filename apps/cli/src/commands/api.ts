import type { AnyProcedureContract, RouterContract } from "@orpc/contract";
import { getOpenAPIMeta } from "@orpc/openapi";
import { contract } from "@woj/contract";
import { type ArgDef, type CommandDef, defineCommand } from "citty";
import { ZodType, z } from "zod";
import { configArgs, getConfig } from "../lib/config";
import { formatIssues, runCommand } from "../lib/error";
import { getOrpcLink } from "../lib/orpc";

type JsonSchema = z.core.JSONSchema.BaseSchema;
function toExample(node: JsonSchema): string {
  if (node.enum)
    return node.enum.map((value) => JSON.stringify(value)).join(" | ");
  const variants = node.anyOf ?? node.oneOf;
  if (variants) return variants.map(toExample).join(" | ");
  if (node.type === "array") return `${toExample(node.items as JsonSchema)}[]`;
  if (node.type === "object") {
    const required = new Set(node.required);
    const fields = Object.entries(node.properties ?? {}).map(
      ([key, value]) =>
        `${key}${required.has(key) ? "" : "?"}: ${toExample(value as JsonSchema)}`,
    );
    return `{ ${fields.join(", ")} }`;
  }
  return [node.type].flat().join(" | ");
}

function onProcedure(contract: AnyProcedureContract, path: string[]) {
  const meta = getOpenAPIMeta(contract) ?? {};
  const inputSchema = contract["~orpc"].inputSchemas?.at(0);
  const pathParams = Array.from(
    meta.path?.matchAll(/\{(\w+)\}/g) ?? [],
  ).flatMap((match) => match.slice(1));

  const args: Record<string, ArgDef> = {};

  if (inputSchema instanceof z.ZodObject) {
    for (const name of pathParams) {
      args[name] = {
        type: "positional",
        required: true,
        description: toExample(z.toJSONSchema(inputSchema.shape[name])),
      };
    }
    const bodySchema = z.object(
      Object.fromEntries(
        Object.entries(inputSchema.shape).filter(
          ([key]) => !pathParams.includes(key),
        ),
      ),
    );
    if (Object.keys(bodySchema.shape).length > 0) {
      args.input = {
        type: "positional",
        required: true,
        description: toExample(z.toJSONSchema(bodySchema)),
      };
    }
  } else if (inputSchema) {
    args.input = {
      type: "positional",
      required: true,
      description:
        inputSchema instanceof ZodType
          ? toExample(z.toJSONSchema(inputSchema))
          : undefined,
    };
  }

  return defineCommand({
    meta: {
      description: meta.description,
    },
    args: configArgs(args),
    run({ args }) {
      return runCommand(async () => {
        const config = await getConfig(args);
        let input: unknown;
        if (inputSchema) {
          const result = await inputSchema["~standard"].validate({
            ...(args.input ? JSON.parse(String(args.input)) : {}),
            ...Object.fromEntries(pathParams.map((name) => [name, args[name]])),
          });
          if (result.issues) throw new Error(formatIssues(result.issues));
          input = result.value;
        }
        const link = getOrpcLink(config);
        const output = await link.call(path, input, { context: {} });
        console.log(JSON.stringify(output));
      });
    },
  }) as CommandDef;
}

function onRouter(
  contract: Exclude<RouterContract, AnyProcedureContract>,
  path: string[],
  description: string,
) {
  return defineCommand({
    meta: { description },
    subCommands: Object.entries(contract).reduce<Record<string, CommandDef>>(
      (p, [key, child]) => {
        if ("~orpc" in child) {
          p[key] = onProcedure(child as AnyProcedureContract, [...path, key]);
        } else {
          p[key] = onRouter(child, [...path, key], `Call the ${key} endpoints`);
        }
        return p;
      },
      {},
    ),
  });
}

export const apiCommand = onRouter(contract, [], "Call the Woj API directly");
