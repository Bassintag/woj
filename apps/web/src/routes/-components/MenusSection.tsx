import { useSuspenseQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Suspense } from "react";
import { MenuCard } from "@/components/menu/MenuCard";
import { q } from "@/lib/orpc";

export function MenusSection() {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="px-layout text-h2 text-fg">Menus</h2>
      <Suspense>
        <MenusSectionContent />
      </Suspense>
    </section>
  );
}

export function MenusSectionContent() {
  const menus = useSuspenseQuery(q.menus.list.queryOptions());

  return (
    <ul className="flex snap-x scroll-px-(--layout-gutter) scrollbar-none flex-row gap-4 overflow-x-scroll px-layout">
      {menus.data.map((menu) => (
        <li key={menu.id} className="shrink-0 snap-start">
          <Link to="/menu/$id" params={{ id: menu.id }} className="rounded-2xl">
            <MenuCard menu={menu} />
          </Link>
        </li>
      ))}
    </ul>
  );
}
