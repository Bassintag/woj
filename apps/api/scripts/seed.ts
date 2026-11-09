import * as tables from "@woj/db";
import { createDb } from "../src/lib/db";
import { createEnv } from "../src/lib/env";

const db = createDb(createEnv());

function shuffle<T>(items: T[]) {
  return [...items].sort(() => Math.random() - 0.5);
}

const recipes = await db
  .select({ id: tables.recipes.id })
  .from(tables.recipes)
  .limit(300);

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

console.log(`Seeded ${menuTitles.length} menus`);
