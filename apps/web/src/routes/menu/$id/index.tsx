import { CaretLeftIcon } from "@phosphor-icons/react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { Menu } from "@woj/contract";
import { Fragment, Suspense, useState } from "react";
import { z } from "zod";
import { CartButton } from "@/components/cart/CartButton";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/Button";
import { q } from "@/lib/orpc";
import { MenuActions } from "./-components/MenuActions";
import { MenuAttributes } from "./-components/MenuAttributes";
import { MenuHero } from "./-components/MenuHero";
import { MenuRecipes } from "./-components/MenuRecipes";

export const Route = createFileRoute("/menu/$id/")({
  component: RouteComponent,
  staticData: { hideNavbar: true },
  params: z.object({
    id: z.coerce.number(),
  }),
});

function RouteComponent() {
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <Fragment>
      <Header>
        <Button size="md" render={<Link to="/" />}>
          <CaretLeftIcon />
        </Button>
        <CartButton open={cartOpen} onOpenChange={setCartOpen} />
      </Header>
      <Suspense>
        <MenuContent onAdded={() => setCartOpen(true)} />
      </Suspense>
    </Fragment>
  );
}

function MenuContent({ onAdded }: { onAdded: () => void }) {
  const id = Route.useParams({ select: (p) => p.id });
  const { data: menu } = useSuspenseQuery(
    q.menus.list.queryOptions({
      select: (menus) => menus.find((m) => m.id === id),
    }),
  );

  if (!menu) {
    throw notFound();
  }

  return <MenuBody key={menu.id} menu={menu} onAdded={onAdded} />;
}

function MenuBody({ menu, onAdded }: { menu: Menu; onAdded: () => void }) {
  const [quantities, setQuantities] = useState<Record<number, number>>(() =>
    Object.fromEntries(menu.meals.map((meal) => [meal.id, meal.quantity])),
  );

  return (
    <Fragment>
      <div className="flex flex-col gap-8 px-layout">
        <MenuHero menu={menu} />
        <MenuAttributes menu={menu} quantities={quantities} />
        <MenuRecipes
          menu={menu}
          quantities={quantities}
          onChange={(mealId, quantity) =>
            setQuantities((prev) => ({ ...prev, [mealId]: quantity }))
          }
        />
      </div>
      <MenuActions menu={menu} quantities={quantities} onAdded={onAdded} />
    </Fragment>
  );
}
