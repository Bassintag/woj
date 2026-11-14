import { constantCase, kebabCase } from "change-case";
import type { ArgsDef, ParsedArgs } from "citty";
import { z } from "zod";

export const ConfigSchema = z.object({
  apiUrl: z.url().optional(),
  apiKey: z.string().optional(),
});

export type Config = z.infer<typeof ConfigSchema>;

export async function getConfig<T extends ArgsDef>(args: ParsedArgs<T>) {
  const configFilePath = "woj.toml";
  const configFile = Bun.file(configFilePath);
  let configFileContent: Config;
  if (await configFile.exists()) {
    configFileContent = ConfigSchema.parse(
      Bun.TOML.parse(await configFile.text()),
    );
  } else {
    configFileContent = {};
  }

  function getArg(key: keyof Config) {
    const argKey = kebabCase(key);
    const argValue = args[argKey];
    if (argValue != null) return argValue;

    const envKey = `WOJ_${constantCase(key)}`;
    const envValue = Bun.env[envKey];
    if (envValue != null) return envValue;

    const configFileKey = key;
    const configFileValue = configFileContent[configFileKey];
    if (configFileValue != null) return configFileValue;

    return undefined;
  }

  return ConfigSchema.parse({
    apiUrl: getArg("apiUrl"),
    apiKey: getArg("apiKey"),
  });
}
