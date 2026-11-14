import {
  closestCenter,
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Fragment, Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { useListStore } from "@/hooks/useListStore";
import { useRecipeSearch } from "@/hooks/useRecipeIndex";
import { pageTitle } from "@/lib/pageTitle";
import { AddItemRow } from "./-components/AddItemRow";
import { ListItemRow } from "./-components/ListItemRow";
import { ListProgress } from "./-components/ListProgress";

export const Route = createFileRoute("/list/")({
  component: RouteComponent,
});

function RouteComponent() {
  const items = useListStore((state) => state.items);
  const move = useListStore((state) => state.move);
  const recipes = useListStore((state) => state.recipes);
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 250, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );
  const todo = items.filter((item) => !item.checked);
  const done = items.filter((item) => item.checked);

  function onDragStart() {
    navigator.vibrate?.(10);
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    if (over) move(String(active.id), String(over.id));
  }

  return (
    <Fragment>
      <title>{pageTitle("Courses")}</title>
      <Header>Courses</Header>
      <div className="flex flex-col gap-8">
        <ListProgress done={done.length} total={items.length} />
        <div className="flex flex-col gap-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={onDragStart}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={todo}
              strategy={verticalListSortingStrategy}
            >
              {todo.map((item) => (
                <ListItemRow key={item.id} item={item} />
              ))}
            </SortableContext>
          </DndContext>
          <AddItemRow />
        </div>
        {done.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="px-layout text-xs text-muted-fg">
              Dans le panier - {done.length}
            </p>
            {done.map((item) => (
              <ListItemRow key={item.id} item={item} />
            ))}
          </div>
        )}
        {recipes.length > 0 && (
          <Suspense>
            <ListRecipes ids={recipes.map((recipe) => recipe.recipeId)} />
          </Suspense>
        )}
      </div>
    </Fragment>
  );
}

function ListRecipes({ ids }: { ids: number[] }) {
  const { get } = useRecipeSearch();
  return (
    <section className="flex flex-col gap-4">
      <h2 className="px-layout text-h2 text-fg">Recettes</h2>
      <ul className="mx-layout grid grid-cols-2 gap-4">
        {ids.filter(get).map((id) => (
          <li key={id}>
            <Link to="/$id" params={{ id }} className="block rounded-2xl">
              <RecipeCard recipe={get(id)} />
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
