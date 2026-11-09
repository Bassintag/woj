import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import { Link } from "@tanstack/react-router";
import type { Menu } from "@woj/contract";
import { Stepper, StepperButton, StepperValue } from "@/components/ui/Stepper";
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
      <h2 className="text-h2 text-fg">Préparation</h2>
      <div className="flex flex-col gap-4">
        {menu.meals.map((meal) => (
          <div key={meal.id} className="flex flex-row items-center gap-4">
            <Link
              className="size-27 shrink-0 overflow-hidden rounded-2xl bg-muted-bg"
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
                <p className="text-sm text-muted-fg">
                  {meal.recipe.calories.toFixed(0)} kcal
                </p>
              )}
              <Stepper className="self-start">
                <StepperButton
                  aria-label="Diminuer"
                  disabled={quantities[meal.id] <= 1}
                  onClick={() => onChange(meal.id, quantities[meal.id] - 1)}
                >
                  <MinusIcon />
                </StepperButton>
                <StepperValue>{quantities[meal.id]} pers.</StepperValue>
                <StepperButton
                  aria-label="Augmenter"
                  onClick={() => onChange(meal.id, quantities[meal.id] + 1)}
                >
                  <PlusIcon />
                </StepperButton>
              </Stepper>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
