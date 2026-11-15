import { useSuspenseQuery } from "@tanstack/react-query";
import { Link, useRouter, useSearch } from "@tanstack/react-router";
import { useWindowVirtualizer } from "@tanstack/react-virtual";
import { range, sortBy } from "es-toolkit";
import { Suspense, useCallback, useRef } from "react";
import { z } from "zod";
import { RecipeCard, RecipeCardSkeleton } from "@/components/recipe/RecipeCard";
import { RecipeSearchInput } from "@/components/recipe/RecipeSearchInput";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tag, TagGroup } from "@/components/ui/Tag";
import { useRecipeSearch } from "@/hooks/useRecipeIndex";
import { useRecipeResults } from "@/hooks/useRecipeResults";
import { q } from "@/lib/orpc";

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
      {title && (
        <h2 className="px-layout font-display text-h2 text-fg">{title}</h2>
      )}
      <div className="flex flex-col gap-4">
        <RecipeSectionInput />
        <Suspense fallback={<RecipeSectionFiltersSkeleton />}>
          <RecipeSectionFilters ids={ids} />
        </Suspense>
      </div>
      <Suspense fallback={<RecipesSectionContentSkeleton />}>
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
          ids.some((id) => api.get(id)?.tagIds.includes(tag.id)),
        )
      : allTags.data,
  };
  const update = useUpdateSearch();
  const selected = useSearch({ strict: false, select: (s) => s.tags });
  const ref = useRef<HTMLDivElement>(null);
  const sorted = sortBy(tags.data, [(tag) => !selected?.includes(tag.id)]);

  return (
    tags.data.length > 0 && (
      <TagGroup
        ref={ref}
        className="-my-2 flex scrollbar-none flex-row gap-3 overflow-x-auto px-layout py-2"
        value={selected?.map(String) ?? []}
        onValueChange={(value) => {
          update({ tags: value.length > 0 ? value.map(Number) : undefined });
          ref.current?.scrollTo({ left: 0, behavior: "smooth" });
        }}
      >
        {sorted.map((tag) => (
          <Tag key={tag.id} value={tag.id.toFixed(0)}>
            {tag.title}
          </Tag>
        ))}
      </TagGroup>
    )
  );
}

function RecipeSectionFiltersSkeleton() {
  return (
    <div className="-my-2 flex flex-row gap-3 overflow-hidden px-layout py-2">
      {range(4).map((i) => (
        <Skeleton key={i} className="h-8 w-20 shrink-0 rounded-full" />
      ))}
    </div>
  );
}

function RecipeSectionInput() {
  const update = useUpdateSearch();
  const search = useSearch({ strict: false, select: (s) => s.q });
  const onSearch = useCallback(
    (value: string) => update({ q: value }),
    [update],
  );

  return (
    <RecipeSearchInput
      className="mx-layout"
      defaultValue={search}
      onSearch={onSearch}
    />
  );
}

function RecipesSectionContentSkeleton() {
  return (
    <div className="mx-layout grid grid-cols-2 gap-4">
      {range(6).map((i) => (
        <RecipeCardSkeleton key={i} />
      ))}
    </div>
  );
}

function RecipesSectionContent({ ids }: { ids?: number[] }) {
  const q = useSearch({ strict: false, select: (s) => s.q });
  const tags = useSearch({ strict: false, select: (s) => s.tags });
  const { api, results } = useRecipeResults({ q, tags, ids });

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
        <p className="text-center text-md text-muted">Aucun résultat</p>
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
