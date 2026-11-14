import { ORPCError } from "@orpc/client";
import { z } from "zod";

interface Issue {
  message: string;
  path?: readonly (PropertyKey | { key: PropertyKey })[];
}

export function formatIssues(issues: readonly Issue[]) {
  return issues
    .map((issue) => {
      const path = issue.path
        ?.map((segment) =>
          String(typeof segment === "object" ? segment.key : segment),
        )
        .join(".");
      return path ? `${path}: ${issue.message}` : issue.message;
    })
    .join("\n");
}

export function formatError(error: unknown) {
  if (error instanceof ORPCError) {
    const data = error.data == null ? "" : ` ${JSON.stringify(error.data)}`;
    return `Error: ${error.code}${data}`;
  }
  if (error instanceof z.ZodError) {
    return formatIssues(error.issues);
  }
  if (error instanceof SyntaxError) {
    return `Invalid JSON input: ${error.message}`;
  }
  if (error instanceof TypeError) {
    return `Cannot reach the Woj API: ${error.message}`;
  }
  return error instanceof Error ? error.message : String(error);
}

export async function runCommand(run: () => Promise<void>) {
  try {
    await run();
  } catch (error) {
    console.error(formatError(error));
    process.exit(1);
  }
}
