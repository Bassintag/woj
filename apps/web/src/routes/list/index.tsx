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
import { createFileRoute } from "@tanstack/react-router";
import { Fragment } from "react";
import { Header } from "@/components/layout/Header";
import { useListStore } from "@/hooks/useListStore";
import { AddItemRow } from "./-components/AddItemRow";
import { ListItemRow } from "./-components/ListItemRow";
import { ListProgress } from "./-components/ListProgress";

export const Route = createFileRoute("/list/")({
  component: RouteComponent,
});

function RouteComponent() {
  const items = useListStore((state) => state.items);
  const move = useListStore((state) => state.move);
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

  function onDragEnd({ active, over }: DragEndEvent) {
    if (over) move(String(active.id), String(over.id));
  }

  return (
    <Fragment>
      <Header>Courses</Header>
      <div className="flex flex-col gap-8">
        <ListProgress done={done.length} total={items.length} />
        <div className="flex flex-col gap-2">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={onDragEnd}
          >
            <SortableContext
              items={todo}
              strategy={verticalListSortingStrategy}
            >
              {todo.map((item, index) => (
                <ListItemRow
                  key={item.id}
                  item={item}
                  last={index === todo.length - 1}
                />
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
      </div>
    </Fragment>
  );
}
