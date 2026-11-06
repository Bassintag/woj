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
  const todo = items.filter((item) => !item.checked);
  const done = items.filter((item) => item.checked);

  return (
    <Fragment>
      <Header>Courses</Header>
      <div className="flex flex-col gap-8 px-layout">
        <ListProgress done={done.length} total={items.length} />
        <div className="flex flex-col gap-2">
          {todo.map((item, index) => (
            <ListItemRow
              key={item.id}
              item={item}
              last={index === todo.length - 1}
            />
          ))}
          <AddItemRow />
        </div>
        {done.length > 0 && (
          <div className="flex flex-col gap-2">
            <p className="text-xs text-muted-fg">
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
