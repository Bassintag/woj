import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useRouter, useSearch } from "@tanstack/react-router";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { debounce } from "es-toolkit";
import { type ChangeEvent, Suspense, useCallback, useMemo } from "react";
import { z } from "zod";
import { Tag, TagGroup } from "@/components/layout/Tag";
import { RecipeCard } from "@/components/recipe/RecipeCard";
import { Input } from "@/components/ui/Input";
import { useRecipeSearch } from "@/hooks/useRecipeIndex";
import { q } from "@/lib/orpc";
import { filterByTags } from "@/lib/recipe";

const COLUMNS = 2;

export const recipeSearchSchema = z.object({
  q: z.string().nullish(),
  tags: z.array(z.number()).optional(),
});

function useUpdateSearch() {
  const router = useRouter();
  return useCallback(
    (patch: z.infer<typeof recipeSearchSchema>) => {
      router.navigate({
        to: ".",
        search: { ...router.state.location.search, ...patch },
        replace: true,
      });
    },
    [router],
  );
}

export function RecipesSection({
  title,
  ids,
}: {
  title?: string;
  ids?: number[];
}) {
  return (
    <section className="flex flex-col gap-6">
      {title && <h2 className="px-layout text-h2 text-fg">{title}</h2>}
      <div className="flex flex-col gap-4">
        <RecipeSectionInput />
        <Suspense>
          <RecipeSectionFilters ids={ids} />
        </Suspense>
      </div>
      <Suspense>
        <RecipesSectionContent ids={ids} />
      </Suspense>
    </section>
  );
}

function RecipeSectionFilters({ ids }: { ids?: number[] }) {
  const allTags = useSuspenseQuery(q.tags.list.queryOptions());
  const api = useRecipeSearch();
  const tags = {
    data: ids
      ? allTags.data.filter((tag) =>
          ids.some((id) => api.get(id)?.tags.some((t) => t.id === tag.id)),
        )
      : allTags.data,
  };
  const update = useUpdateSearch();
  const selected = useSearch({ strict: false, select: (s) => s.tags });

  return (
    tags.data.length > 0 && (
      <TagGroup
        className="-my-2 flex scrollbar-none flex-row gap-3 overflow-x-auto px-layout py-2"
        value={selected?.map(String) ?? []}
        onValueChange={(value) =>
          update({ tags: value.length > 0 ? value.map(Number) : undefined })
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
  const update = useUpdateSearch();
  const search = useSearch({ strict: false, select: (s) => s.q });
  const onChange = useMemo(
    () =>
      debounce((e: ChangeEvent<HTMLInputElement>) => {
        update({ q: e.target.value });
      }, 500),
    [update],
  );

  return (
    <Input
      placeholder="Search"
      className="mx-layout"
      defaultValue={search ?? ""}
      onChange={onChange}
    />
  );
}

function RecipesSectionContent({ ids }: { ids?: number[] }) {
  const api = useRecipeSearch();
  const q = useSearch({ strict: false, select: (s) => s.q });
  const tags = useSearch({ strict: false, select: (s) => s.tags });
  let results: { id: number }[] = q ? api.index.search(q) : api.recipes;
  if (ids) {
    results = results.filter((result) => ids.includes(result.id));
  }
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

  if (results.length === 0) {
    return (
      <div className="mx-layout flex h-36 items-center justify-center">
        <p className="text-center text-md text-muted-fg">Aucun résultat</p>
      </div>
    );
  }

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
                search={{ from: ids ? "favorites" : undefined }}
                className="block rounded-2xl"
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
