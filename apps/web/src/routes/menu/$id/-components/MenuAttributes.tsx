import { BowlSteamIcon, FireIcon, ForkKnifeIcon } from "@phosphor-icons/react";
import type { Menu } from "@woj/contract";
import { DetailsCard } from "@/routes/$id/-components/DetailsSection";

export function MenuAttributes({
  menu,
  quantities,
}: {
  menu: Menu;
  quantities: Record<number, number>;
}) {
  const portions = menu.meals.reduce(
    (sum, meal) => sum + quantities[meal.id],
    0,
  );
  const calories = menu.meals.reduce(
    (sum, meal) => sum + (meal.recipe.calories ?? 0) * quantities[meal.id],
    0,
  );

  return (
    <div className="grid grid-cols-3 gap-4">
      <DetailsCard
        icon={<ForkKnifeIcon />}
        title={menu.meals.length}
        description="recettes"
      />
      <DetailsCard
        icon={<BowlSteamIcon />}
        title={portions}
        description="portions"
      />
      <DetailsCard
        icon={<FireIcon />}
        title={`${(calories / portions).toFixed(0)} kcal`}
        description="par portion"
      />
    </div>
  );
}
