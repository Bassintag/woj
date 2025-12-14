import type { Prisma } from "@prisma/client";
import { constituentSelect } from "./constituent";
import { tagSelect } from "./tag";
import { stepSelect } from "./step";
import { toolSelect } from "./tool";

export const recipeSelect = {
  id: true,
  name: true,
  imagePath: true,
  cookingTime: true,
  preppingTime: true,
  energy: true,
  constituents: {
    select: constituentSelect,
    orderBy: { ingredient: { name: "asc" } },
  },
  steps: { select: stepSelect, orderBy: { order: "asc" } },
  tags: { select: tagSelect, orderBy: { name: "asc" } },
  tools: { select: toolSelect, orderBy: { name: "asc" } },
} satisfies Prisma.RecipeSelect;
