import { constantCase } from "change-case";
import type { ArgsDef, ParsedArgs } from "citty";
import { z } from "zod";

export const ConfigSchema = z.object({
  apiUrl: z.url().default("http://localhost:3000"),
  apiKey: z.string().optional(),
});

export type Config = z.infer<typeof ConfigSchema>;

export async function getConfig(
  args: Pick<ParsedArgs<ConfigArgs>, keyof Config>,
) {
  const configFilePath = "woj.toml";
  const configFile = Bun.file(configFilePath);
  let configFileContent: Partial<Config>;
  if (await configFile.exists()) {
    configFileContent = ConfigSchema.parse(
      Bun.TOML.parse(await configFile.text()),
    );
  } else {
    configFileContent = {};
  }

  function getArg(key: keyof Config) {
    const argValue = args[key];
    if (argValue != null) return argValue;

    const envKey = `WOJ_${constantCase(key)}`;
    const envValue = Bun.env[envKey];
    if (envValue != null) return envValue;

    const configFileValue = configFileContent[key];
    if (configFileValue != null) return configFileValue;

    return undefined;
  }

  return ConfigSchema.parse({
    apiUrl: getArg("apiUrl"),
    apiKey: getArg("apiKey"),
  });
}

export function configArgs<T extends ArgsDef>(args: T = {} as T) {
  return {
    ...args,
    apiUrl: {
      type: "string",
      description:
        "Base URL of the Woj API (env: WOJ_API_URL, default: http://localhost:3000)",
    },
    apiKey: {
      type: "string",
      description: "API key used to authenticate (env: WOJ_API_KEY)",
    },
  } satisfies ArgsDef;
}

export type ConfigArgs = ReturnType<typeof configArgs>;
