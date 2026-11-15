import { SignInIcon } from "@phosphor-icons/react";
import { type PropsWithChildren, useState } from "react";
import { z } from "zod";
import {
  Drawer,
  DrawerActions,
  DrawerContent,
  DrawerHeader,
  DrawerPopup,
  DrawerTitle,
} from "@/components/ui/Drawer";
import { toastManager } from "@/components/ui/Toast";
import { useAppForm } from "@/hooks/useAppForm";
import { login } from "@/lib/auth";

const LoginFormSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

type LoginFormValues = z.infer<typeof LoginFormSchema>;

const defaultValues = {
  username: "",
  password: "",
} satisfies LoginFormValues;

export function LoginFormDrawer({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const form = useAppForm({
    defaultValues,
    validators: { onSubmit: LoginFormSchema },
    async onSubmit({ value }) {
      try {
        await login(value.username, value.password);
      } catch {
        toastManager.add({
          type: "error",
          title: "Erreur",
          description: "Identifiants invalides",
        });
        return;
      }
      setOpen(false);
    },
  });

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {children}
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
          <DrawerTitle>Connexion</DrawerTitle>
        </DrawerHeader>
        <DrawerContent className="flex flex-col gap-4">
          <form.AppField name="username">
            {(field) => (
              <field.InputField
                label="Nom d'utilisateur"
                placeholder="Nom d'utilisateur"
              />
            )}
          </form.AppField>
          <form.AppField name="password">
            {(field) => (
              <field.InputField
                label="Mot de passe"
                placeholder="Mot de passe"
                type="password"
              />
            )}
          </form.AppField>
        </DrawerContent>
        <DrawerActions>
          <form.AppForm>
            <form.SubmitButton type="submit" variant="brand">
              <SignInIcon />
              Connexion
            </form.SubmitButton>
          </form.AppForm>
        </DrawerActions>
      </DrawerPopup>
    </Drawer>
  );
}
