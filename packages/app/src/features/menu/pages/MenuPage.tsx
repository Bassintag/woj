import { PageTitle } from "@/features/recipe/components/PageTitle";
import { useCreateMenu } from "@/features/menu/hooks/useCreateMenu";
import { Button } from "@/components/Button";
import { useMenuPageState } from "@/features/menu/hooks/useMenuPageState";
import { QuantitySelector } from "@/components/QuantitySelector";
import { TagSelect } from "@/features/tag/components/TagSelect";
import { MenuRecipesList } from "@/features/menu/components/MenuRecipesList";

export const MenuPage = () => {
  const { quantity, tags, setMenu, setQuantity, setTags } = useMenuPageState();
  const { mutate, isPending } = useCreateMenu();

  const handleClick = () => {
    mutate({ quantity, tags }, { onSuccess: setMenu });
  };

  return (
    <div className="container py-6 flex flex-col gap-6">
      <PageTitle>Menu</PageTitle>
      <div className="flex flex-col gap-6 items-center mx-auto w-64 lg:w-96">
        <QuantitySelector value={quantity} max={50} onChange={setQuantity} />
        <div className="flex flex-row gap-3">
          <Button
            className="self-stretch"
            disabled={isPending}
            onClick={handleClick}
          >
            Nouveau menu
          </Button>
          <TagSelect value={tags} onChange={setTags} />
        </div>
      </div>
      <MenuRecipesList />
    </div>
  );
};

export const element = <MenuPage />;
