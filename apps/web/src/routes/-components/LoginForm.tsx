import { useAppForm } from "@/hooks/useAppForm";

export function LoginForm() {
  const form = useAppForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  return (
    <form>
      <form.AppField name="username">
        {(field) => (
          <field.Root label="Nom d'utilisateur">
            <field.Input placeholder="Nom d'utilisateur" />
          </field.Root>
        )}
      </form.AppField>
    </form>
  );
}
