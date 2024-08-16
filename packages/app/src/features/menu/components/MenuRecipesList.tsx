import { useMenuPageState } from "@/features/menu/hooks/useMenuPageState";
import { Recipe } from "@/features/recipe/domain/Recipe";
import { Image } from "@/components/Image";
import { Button } from "@/components/Button";
import { RefreshCwIcon, TrashIcon } from "lucide-react";
import { useCreateMenu } from "@/features/menu/hooks/useCreateMenu";
import { Link } from "react-router-dom";
import React from "react";

export const MenuRecipesList = () => {
  const menu = useMenuPageState((s) => s.menu);

  return (
    <ul className="flex flex-col gap-3">
      {menu?.recipes.map((recipe) => (
        <MenuRecipesListRow key={recipe.id} recipe={recipe} />
      ))}
    </ul>
  );
};

export interface MenuRecipesListProps {
  recipe: Recipe;
}

export const MenuRecipesListRow = ({ recipe }: MenuRecipesListProps) => {
  const [menu, setMenu, tags] = useMenuPageState((s) => [
    s.menu,
    s.setMenu,
    s.tags,
  ]);
  const { mutate: createMenu, isPending } = useCreateMenu();

  const handleRefresh = (e: React.MouseEvent) => {
    e.preventDefault();
    createMenu(
      { quantity: 1, tags, exclude: menu?.recipes.map((r) => r.id) },
      {
        onSuccess: ({ recipes }) => {
          if (menu == null || recipes.length < 0) return;
          const index = menu.recipes.findIndex((r) => r.id === recipe.id);
          if (index < 0) return;
          const copy = [...menu.recipes];
          copy.splice(index, 1, recipes[0]);
          setMenu({ ...menu, recipes: copy });
        },
      },
    );
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (menu == null) return;
    setMenu({
      ...menu,
      recipes: menu.recipes.filter((r) => r.id !== recipe.id),
    });
  };

  return (
    <li>
      <Link
        to={`/recipes/${recipe.id}?back=/menu`}
        className="flex flex-row gap-3"
      >
        <Image
          className="size-24 bg-gray-100 rounded-xl shrink-0"
          path={recipe.imagePath}
        />
        <div className="flex flex-col gap-3 py-2">
          <h3 className="leading-4 font-medium">{recipe.name}</h3>
          <div className="flex flex-row gap-1 mt-auto">
            <Button
              size="sm"
              colorScheme="white"
              onClick={handleRefresh}
              disabled={isPending}
            >
              <RefreshCwIcon />
              <span>Changer</span>
            </Button>
            <Button size="sm" colorScheme="white" onClick={handleDelete}>
              <TrashIcon />
              <span>Supprimer</span>
            </Button>
          </div>
        </div>
      </Link>
    </li>
  );
};
