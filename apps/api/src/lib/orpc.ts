import { implement } from "@orpc/server";
import { contract } from "@woj/contract";
import type { Context } from "../context";

export const orpc = implement(contract).$context<Context>();
