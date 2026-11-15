import { MinusIcon, PlusIcon } from "@phosphor-icons/react";
import type { Menu } from "@woj/contract";
import { AuthGate } from "@/components/auth/AuthGate";
import { RecipeRow } from "@/components/recipe/RecipeRow";
import {
  Stepper,
  StepperDecrement,
  StepperIncrement,
  StepperValue,
} from "@/components/ui/Stepper";
import { MenuMealsDrawer } from "./MenuMealsDrawer";

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
      <div className="flex flex-row items-center justify-between">
        <h2 className="font-display text-h2 text-fg">Repas</h2>
        <AuthGate>
          <MenuMealsDrawer menu={menu} />
        </AuthGate>
      </div>
      <div className="flex flex-col gap-4">
        {menu.meals.length === 0 && (
          <div className="flex h-36 items-center justify-center">
            <p className="text-center text-md text-muted">Aucun repas</p>
          </div>
        )}
        {menu.meals.map((meal) => (
          <RecipeRow key={meal.id} recipe={meal.recipe} link>
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
          </RecipeRow>
        ))}
      </div>
    </section>
  );
}
