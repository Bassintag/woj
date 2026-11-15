import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import type { Menu } from "@woj/contract";
import {
  Stepper,
  StepperDecrement,
  StepperIncrement,
  StepperValue,
} from "@/components/ui/Stepper";
import { image } from "@/lib/image";

export function MenuRecipes({
  menu,
  quantities,
  onChange,
}: {
  menu: Menu;
  quantities: Record<number, number>;
  onChange: (mealId: number, quantity: number) => void;
}) {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="font-display text-h2 text-fg">Préparation</h2>
      <div className="flex flex-col gap-4">
        {menu.meals.map((meal) => (
          <div key={meal.id} className="flex flex-row items-center gap-4">
            <Link
              className="size-27 shrink-0 overflow-hidden rounded-2xl bg-surface"
              to="/$id"
              params={{ id: meal.recipe.id }}
            >
              {meal.recipe.imageUrl && (
                <img
                  className="size-full object-cover"
                  alt={meal.recipe.title}
                  src={image(meal.recipe.imageUrl)}
                />
              )}
            </Link>
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <Link
                className="text-md text-fg"
                to="/$id"
                params={{ id: meal.recipe.id }}
              >
                {meal.recipe.title}
              </Link>
              {meal.recipe.calories != null && (
                <p className="text-sm text-muted">
                  {meal.recipe.calories.toFixed(0)} kcal
                </p>
              )}
              <Stepper
                className="self-start"
                value={quantities[meal.id]}
                onValueChange={(value) =>
                  value != null && onChange(meal.id, value)
                }
              >
                <StepperDecrement aria-label="Diminuer">
                  <MinusIcon />
                </StepperDecrement>
                <StepperValue>{quantities[meal.id]} pers.</StepperValue>
                <StepperIncrement aria-label="Augmenter">
                  <PlusIcon />
                </StepperIncrement>
              </Stepper>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
