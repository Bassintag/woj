import { useSuspenseQuery } from "@tanstack/react-query";
import { getRouteApi, Link } from "@tanstack/react-router";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { debounce } from "es-toolkit";
import { type ChangeEvent, Suspense, useCallback } from "react";
import { Tag, TagGroup } from "@/components/layout/Tag";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { Input } from "@/components/ui/Input";
import { useRecipeSearch } from "@/hooks/useRecipeIndex";
import { q } from "@/lib/orpc";
import { filterByTags } from "@/lib/recipe";

const Route = getRouteApi("/");

const COLUMNS = 2;

export function RecipesSection() {
  return (
    <section className="flex flex-col gap-6">
      <h2 className="px-layout text-h2 text-fg">Recettes</h2>
      <div className="flex flex-col gap-4">
        <RecipeSectionInput />
        <Suspense>
          <RecipeSectionFilters />
        </Suspense>
      </div>
      <Suspense>
        <RecipesSectionContent />
      </Suspense>
    </section>
  );
}

function RecipeSectionFilters() {
  const tags = useSuspenseQuery(q.tags.list.queryOptions());
  const navigate = Route.useNavigate();
  const selected = Route.useSearch({ select: (s) => s.tags });

  return (
    tags.data.length > 0 && (
      <TagGroup
        className="flex scrollbar-none flex-row gap-3 overflow-x-auto px-layout"
        value={selected?.map(String) ?? []}
        onValueChange={(value) =>
          navigate({
            search: (prev) => ({
              ...prev,
              tags: value.length > 0 ? value.map(Number) : undefined,
            }),
            replace: true,
          })
        }
      >
        {tags.data.map((tag) => (
          <Tag key={tag.id} value={tag.id.toFixed(0)}>
            {tag.title}
          </Tag>
        ))}
      </TagGroup>
    )
  );
}

function RecipeSectionInput() {
  const navigate = Route.useNavigate();
  const search = Route.useSearch({ select: (s) => s.q });

  return (
    <Input
      placeholder="Search"
      className="mx-layout"
      defaultValue={search ?? ""}
      onChange={useCallback(
        debounce((e: ChangeEvent<HTMLInputElement>) => {
          navigate({
            search: (prev) => ({ ...prev, q: e.target.value }),
            replace: true,
          });
        }, 500),
        [],
      )}
    />
  );
}

function RecipesSectionContent() {
  const api = useRecipeSearch();
  const q = Route.useSearch({ select: (s) => s.q });
  const tags = Route.useSearch({ select: (s) => s.tags });
  let results: { id: number }[] = q ? api.index.search(q) : api.recipes;
  if (tags) {
    results = filterByTags(results, tags, api.get);
  }

  const virtualizer = useWindowVirtualizer({
    count: Math.ceil(results.length / COLUMNS),
    estimateSize: () => 260,
    gap: 16,
    overscan: 8,
    getItemKey: (index) => results[index * COLUMNS].id,
    directDomUpdates: true,
  });

  return (
    <ol className="relative mx-layout" ref={virtualizer.containerRef}>
      {virtualizer.getVirtualItems().map((row) => {
        const start = row.index * COLUMNS;
        return (
          <li
            key={row.key}
            data-index={row.index}
            ref={virtualizer.measureElement}
            className="absolute top-0 left-0 grid w-full grid-cols-2 gap-4"
          >
            {results.slice(start, start + COLUMNS).map((result) => (
              <Link
                key={result.id}
                to="/$id"
                params={{ id: result.id }}
                className="rounded-2xl"
              >
                <RecipeCard recipe={api.get(result.id)} />
              </Link>
            ))}
          </li>
        );
      })}
    </ol>
  );
}
