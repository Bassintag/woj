import {
  FloppyDiskIcon,
  MinusIcon,
  PencilSimpleIcon,
  PlusIcon,
  TrashIcon,
} from "@phosphor-icons/react";
import { useSelector } from "@tanstack/react-form";
import { useMutation } from "@tanstack/react-query";
import { useVirtualizer } from "@tanstack/react-virtual";
import type { Menu, RecipeListItem } from "@woj/contract";
import { isEqual, range } from "es-toolkit";
import { Fragment, memo, Suspense, useMemo, useState } from "react";
import { RecipeRow } from "@/components/recipe/RecipeRow";
import { RecipeSearchInput } from "@/components/recipe/RecipeSearchInput";
import { Button } from "@/components/ui/Button";
import {
  Drawer,
  DrawerActions,
  DrawerContent,
  DrawerHeader,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/Drawer";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  Stepper,
  StepperDecrement,
  StepperIncrement,
  StepperValue,
} from "@/components/ui/Stepper";
import { useAppForm, useFormContext } from "@/hooks/useAppForm";
import { useRecipeResults } from "@/hooks/useRecipeResults";
import { q } from "@/lib/orpc";
import { queryClient } from "@/lib/query";

const DEFAULT_QUANTITY = 2;

function useMenuMealsForm(menu: Menu, onSaved: () => void) {
  const update = useMutation(
    q.menus.update.mutationOptions({
      async onSuccess(data) {
        await queryClient.invalidateQueries({ queryKey: q.menus.list.key() });
        queryClient.setQueryData(
          q.menus.get.queryKey({ input: { id: data.id } }),
          data,
        );
        onSaved();
      },
    }),
  );

  return useAppForm({
    defaultValues: {
      meals: menu.meals.map((meal) => ({
        recipeId: meal.recipe.id,
        quantity: meal.quantity,
      })),
    },
    onSubmit({ value }) {
      return update.mutateAsync({ id: menu.id, meals: value.meals });
    },
  });
}

type MealsForm = ReturnType<typeof useMenuMealsForm>;

function useMealsForm() {
  return useFormContext() as unknown as MealsForm;
}

function setQuantity(form: MealsForm, recipeId: number, quantity: number) {
  form.setFieldValue("meals", (meals) =>
    meals.map((meal) =>
      meal.recipeId === recipeId ? { ...meal, quantity } : meal,
    ),
  );
}

export function MenuMealsDrawer({ menu }: { menu: Menu }) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger
        render={<Button size="sm" aria-label="Modifier les repas" />}
      >
        <PencilSimpleIcon />
      </DrawerTrigger>
      <DrawerPopup>
        <MenuMealsDrawerContent menu={menu} onSaved={() => setOpen(false)} />
      </DrawerPopup>
    </Drawer>
  );
}

function MenuMealsDrawerContent({
  menu,
  onSaved,
}: {
  menu: Menu;
  onSaved: () => void;
}) {
  const form = useMenuMealsForm(menu, onSaved);
  const [scroll, setScroll] = useState<HTMLDivElement | null>(null);

  return (
    <form
      className="flex min-h-0 flex-1 flex-col"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <DrawerHeader>
        <DrawerTitle>Modifier les repas</DrawerTitle>
      </DrawerHeader>
      <DrawerContent ref={setScroll} className="relative pt-0">
        <form.AppForm>
          <MealsPicker scroll={scroll} />
        </form.AppForm>
      </DrawerContent>
      <DrawerActions>
        <form.AppForm>
          <form.SubmitButton variant="brand">
            <FloppyDiskIcon />
            <form.Subscribe selector={(state) => state.values.meals.length}>
              {(count) => `Enregistrer ${count} repas`}
            </form.Subscribe>
          </form.SubmitButton>
        </form.AppForm>
      </DrawerActions>
    </form>
  );
}

function MealsPicker({ scroll }: { scroll: HTMLDivElement | null }) {
  const [search, setSearch] = useState("");

  return (
    <Fragment>
      <div className="sticky top-0 z-10 bg-bg pt-2 pb-4">
        <RecipeSearchInput onSearch={setSearch} />
      </div>
      <Suspense fallback={<MealsSkeleton />}>
        <MealsList search={search} scroll={scroll} />
      </Suspense>
    </Fragment>
  );
}

function MealsSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {range(4).map((i) => (
        <Skeleton key={i} className="h-27 rounded-2xl" />
      ))}
    </div>
  );
}

function MealsList({
  search,
  scroll,
}: {
  search: string;
  scroll: HTMLDivElement | null;
}) {
  const form = useMealsForm();
  const [list, setList] = useState<HTMLOListElement | null>(null);
  const ids = useSelector(
    form.store,
    (state) => state.values.meals.map((meal) => meal.recipeId),
    { compare: isEqual },
  );
  const { api, results: found } = useRecipeResults({ q: search });
  const results = useMemo(() => {
    if (search) return found;
    const added = new Set(ids);
    return [
      ...ids.map((id) => ({ id })),
      ...found.filter((result) => !added.has(result.id)),
    ];
  }, [search, found, ids]);
  const virtualizer = useVirtualizer({
    count: results.length,
    getScrollElement: () => scroll,
    scrollMargin: list?.offsetTop ?? 0,
    estimateSize: () => 108,
    gap: 16,
    overscan: 8,
    getItemKey: (index) => results[index].id,
  });

  if (results.length === 0) {
    return (
      <div className="flex h-36 items-center justify-center">
        <p className="text-center text-md text-muted">Aucun résultat</p>
      </div>
    );
  }

  return (
    <ol
      ref={setList}
      className="relative"
      style={{ height: virtualizer.getTotalSize() }}
    >
      {virtualizer.getVirtualItems().map((row) => (
        <li
          key={row.key}
          data-index={row.index}
          ref={virtualizer.measureElement}
          className="absolute top-0 left-0 w-full"
          style={{
            transform: `translateY(${row.start - virtualizer.options.scrollMargin}px)`,
          }}
        >
          <MealRow recipe={api.get(results[row.index].id)} />
        </li>
      ))}
    </ol>
  );
}

const MealRow = memo(function MealRow({ recipe }: { recipe: RecipeListItem }) {
  const form = useMealsForm();
  const quantity = useSelector(form.store, (state) => {
    return state.values.meals.find((meal) => meal.recipeId === recipe.id)
      ?.quantity;
  });

  return (
    <RecipeRow recipe={recipe}>
      <div className="flex flex-row items-center justify-between">
        {quantity != null ? (
          <Fragment>
            <Stepper
              value={quantity}
              onValueChange={(value) =>
                value != null && setQuantity(form, recipe.id, value)
              }
            >
              <StepperDecrement aria-label="Diminuer">
                <MinusIcon />
              </StepperDecrement>
              <StepperValue>{quantity}</StepperValue>
              <StepperIncrement aria-label="Augmenter">
                <PlusIcon />
              </StepperIncrement>
            </Stepper>
            <Button
              size="sm"
              aria-label="Supprimer"
              onClick={() => {
                const index = form
                  .getFieldValue("meals")
                  .findIndex((meal) => meal.recipeId === recipe.id);
                form.removeFieldValue("meals", index);
              }}
            >
              <TrashIcon />
            </Button>
          </Fragment>
        ) : (
          <Button
            className="ml-auto"
            size="sm"
            variant="brand"
            onClick={() => {
              form.pushFieldValue("meals", {
                recipeId: recipe.id,
                quantity: DEFAULT_QUANTITY,
              });
            }}
          >
            <PlusIcon />
            Ajouter
          </Button>
        )}
      </div>
    </RecipeRow>
  );
});
