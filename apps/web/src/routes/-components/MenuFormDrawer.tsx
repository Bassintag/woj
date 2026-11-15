import { FloppyDiskIcon } from "@phosphor-icons/react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { CreateMenuSchema, type Menu } from "@woj/contract";
import { type PropsWithChildren, type ReactNode, useState } from "react";
import type { z } from "zod";
import {
  Drawer,
  DrawerActions,
  DrawerContent,
  DrawerHeader,
  DrawerPopup,
  DrawerTitle,
} from "@/components/ui/Drawer";
import { useAppForm } from "@/hooks/useAppForm";
import { q } from "@/lib/orpc";
import { queryClient } from "@/lib/query";

const MenuFormSchema = CreateMenuSchema.pick({
  title: true,
});

type MenuFormValues = z.infer<typeof MenuFormSchema>;

const defaultValues: MenuFormValues = {
  title: "",
};

export function MenuFormDrawer({
  title,
  defaultValues: propsDefaultValues,
  onSubmit,
}: {
  title: ReactNode;
  defaultValues?: MenuFormValues;
  onSubmit: (values: MenuFormValues) => void;
}) {
  const form = useAppForm({
    defaultValues: propsDefaultValues ?? defaultValues,
    validators: { onSubmit: MenuFormSchema },
    onSubmit({ value }) {
      return onSubmit(value);
    },
  });

  return (
    <DrawerPopup
      render={
        <form
          autoComplete="off"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        />
      }
    >
      <DrawerHeader>
        <DrawerTitle>{title}</DrawerTitle>
      </DrawerHeader>
      <DrawerContent className="flex flex-col gap-4">
        <form.AppField name="title">
          {(field) => (
            <field.InputField label="Titre" placeholder="Titre du menu" />
          )}
        </form.AppField>
      </DrawerContent>
      <DrawerActions>
        <form.AppForm>
          <form.SubmitButton type="submit" variant="brand">
            <FloppyDiskIcon />
            Enregistrer
          </form.SubmitButton>
        </form.AppForm>
      </DrawerActions>
    </DrawerPopup>
  );
}

export function CreateMenuFormDrawer({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const createMenu = useMutation(
    q.menus.create.mutationOptions({
      async onSuccess(data) {
        queryClient.setQueryData(
          q.menus.get.queryKey({ input: { id: data.id } }),
          data,
        );
        await queryClient.invalidateQueries({
          queryKey: q.menus.list.key(),
        });
        setOpen(false);
        await navigate({ to: "/menu/$id", params: { id: data.id } });
      },
    }),
  );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {children}
      <MenuFormDrawer
        title="Nouveau menu"
        onSubmit={(values) => {
          return createMenu.mutateAsync({ ...values, meals: [] });
        }}
      />
    </Drawer>
  );
}

export function UpdateMenuFormDrawer({
  children,
  menu,
}: PropsWithChildren & { menu: Menu }) {
  const [open, setOpen] = useState(false);
  const updateMenu = useMutation(
    q.menus.update.mutationOptions({
      async onSuccess(data) {
        queryClient.setQueryData(
          q.menus.get.queryKey({ input: { id: data.id } }),
          data,
        );
        await queryClient.invalidateQueries({
          queryKey: q.menus.list.key(),
        });
        setOpen(false);
      },
    }),
  );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {children}
      <MenuFormDrawer
        title="Modifier le menu"
        defaultValues={{ title: menu.title }}
        onSubmit={(values) => {
          return updateMenu.mutateAsync({ ...values, id: menu.id });
        }}
      />
    </Drawer>
  );
}
