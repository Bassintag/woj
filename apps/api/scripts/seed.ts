import * as tables from "@woj/db";
import { createDb } from "../src/lib/db";
import { createEnv } from "../src/lib/env";

const db = createDb(createEnv());

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

// Tags

const tagValues = [
  { title: "Plat", color: "#ef4444" },
  { title: "Entrée", color: "#22c55e" },
  { title: "Dessert", color: "#ec4899" },
  { title: "Apéro", color: "#f59e0b" },
  { title: "Petit-déjeuner", color: "#eab308" },
  { title: "Végétarien", color: "#16a34a" },
  { title: "Rapide", color: "#3b82f6" },
  { title: "Soupe", color: "#f97316" },
];

const dbTags = await db
  .insert(tables.tags)
  .values(tagValues)
  .onConflictDoUpdate({
    target: [tables.tags.title],
    set: { color: tables.tags.color },
  })
  .returning();

const tagByTitle = new Map(dbTags.map((t) => [t.title, t.id]));

// Recipes -> tags (random assignment for testing)

const recipes = await db
  .select({ id: tables.recipes.id })
  .from(tables.recipes)
  .limit(300);

const recipesToTags = recipes.flatMap((recipe) => {
  const main = shuffle(["Plat", "Entrée", "Dessert", "Apéro"])[0] as string;
  const extras = shuffle(["Végétarien", "Rapide", "Soupe"]).slice(
    0,
    Math.floor(Math.random() * 3),
  );
  return [main, ...extras].map((title) => ({
    recipeId: recipe.id,
    tagId: tagByTitle.get(title) as number,
  }));
});

await db
  .insert(tables.recipesToTags)
  .values(recipesToTags)
  .onConflictDoNothing();

// Menus

const menuTitles = [
  "Semaine équilibrée",
  "Dîner entre amis",
  "Repas du dimanche",
  "Express du soir",
];

for (const title of menuTitles) {
  const [menu] = await db.insert(tables.menus).values({ title }).returning();
  if (!menu) continue;

  const picked = shuffle(recipes).slice(0, 4 + Math.floor(Math.random() * 3));
  await db.insert(tables.meals).values(
    picked.map((recipe, order) => ({
      order,
      quantity: 1 + Math.floor(Math.random() * 4),
      menuId: menu.id,
      recipeId: recipe.id,
    })),
  );
}

console.log(
  `Seeded ${dbTags.length} tags, ${recipesToTags.length} recipe tags, ${menuTitles.length} menus`,
);
