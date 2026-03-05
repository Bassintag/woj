import { Searchbar } from "@/components/Searchbar";
import { PageTitle } from "@/features/recipe/components/PageTitle";
import { RecipeList } from "@/features/recipe/components/RecipeList";
import { useInfiniteItems } from "@/hooks/useInfiniteItems";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useSearchParams } from "react-router-dom";
import { recipesOptions } from "../queries";

export const RecipesPage = () => {
  const [searchParams] = useSearchParams();
  const query = useInfiniteQuery(
    recipesOptions({
      search: searchParams.get("search") ?? undefined,
      size: 18,
    }),
  );
  const items = useInfiniteItems(query.data);
  const { ref } = useInView({
    skip: !query.hasNextPage || query.isFetchingNextPage,
    onChange: (inView) => {
      if (inView) void query.fetchNextPage();
    },
  });

  return (
    <div className="container py-6 flex flex-col gap-6">
      <PageTitle>Recettes</PageTitle>
      <Searchbar placeholder="Rechercher" />
      {items && <RecipeList recipes={items} />}
      {query.hasNextPage && (
        <button ref={ref} disabled={query.isFetchingNextPage}>
          Charger plus
        </button>
      )}
    </div>
  );
};

export const element = <RecipesPage />;
