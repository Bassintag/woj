import { useRecipes } from "@/features/recipe/hooks/useRecipes";
import { useInfiniteItems } from "@/hooks/useInfiniteItems";
import { useSearchParams } from "react-router-dom";

import { useInView } from "react-intersection-observer";
import { RecipeList } from "@/features/recipe/components/RecipeList";
import { Searchbar } from "@/components/Searchbar";

export const RecipesPage = () => {
  const [searchParams] = useSearchParams();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } = useRecipes({
    search: searchParams.get("search") ?? undefined,
    size: 18,
  });
  const items = useInfiniteItems(data);
  const { ref } = useInView({
    skip: !hasNextPage || isFetchingNextPage,
    onChange: (inView) => {
      if (inView) void fetchNextPage();
    },
  });

  return (
    <div className="container py-6 flex flex-col gap-6">
      <Searchbar className="mx-auto w-1/2" placeholder="Rechercher" />
      {items && <RecipeList recipes={items} />}
      {hasNextPage && (
        <button ref={ref} disabled={isFetchingNextPage}>
          Charger plus
        </button>
      )}
    </div>
  );
};

export const element = <RecipesPage />;
