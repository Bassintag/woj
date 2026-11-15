import { PencilSimpleIcon } from "@phosphor-icons/react";
import type { Menu } from "@woj/contract";
import { AuthGate } from "@/components/auth/AuthGate";
import { Button } from "@/components/ui/Button";
import { DrawerTrigger } from "@/components/ui/Drawer";
import { image } from "@/lib/image";
import { UpdateMenuFormDrawer } from "@/routes/-components/MenuFormDrawer";

export function MenuHero({ menu }: { menu: Menu }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex h-64 items-center justify-center rounded-4xl bg-surface">
        <div className="grid aspect-square h-full grid-cols-2 gap-2 p-2">
          {menu.meals.slice(0, 4).map((meal) => (
            <div key={meal.id}>
              {meal.recipe.imageUrl && (
                <img
                  className="aspect-square w-full rounded-lg object-cover"
                  alt={meal.recipe.title}
                  src={image(meal.recipe.imageUrl)}
                />
              )}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-row items-center justify-between">
        <h1 className="font-display text-h1 text-fg">{menu.title}</h1>
        <AuthGate>
          <UpdateMenuFormDrawer menu={menu}>
            <DrawerTrigger render={<Button size="sm" />}>
              <PencilSimpleIcon />
            </DrawerTrigger>
          </UpdateMenuFormDrawer>
        </AuthGate>
      </div>
    </div>
  );
}
