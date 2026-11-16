import { expect, spyOn, test } from "bun:test";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DrawerTrigger } from "@/components/ui/Drawer";
import { toastManager } from "@/components/ui/Toast";
import { installFakeApi, route } from "@/test/mocks";
import { renderWithProviders } from "@/test/render";
import { LoginFormDrawer } from "./LoginFormDrawer";

function jwt(payload: object) {
  return `h.${btoa(JSON.stringify(payload))}.s`;
}

const exp = Date.now() / 1000 + 3600;
const tokens = {
  access: jwt({ typ: "access", exp }),
  refresh: jwt({ typ: "refresh", exp, id: "r" }),
};

installFakeApi();

async function setup() {
  renderWithProviders(
    <LoginFormDrawer>
      <DrawerTrigger>Ouvrir</DrawerTrigger>
    </LoginFormDrawer>,
  );
  const user = userEvent.setup();
  await user.click(screen.getByText("Ouvrir"));
  await screen.findByRole("dialog");
  return user;
}

test("requires both fields", async () => {
  const create = route("POST /tokens", tokens);
  const user = await setup();
  await user.click(screen.getByRole("button", { name: "Connexion" }));
  await waitFor(() => expect(screen.getAllByText(/too small/i).length).toBe(2));
  expect(create).not.toHaveBeenCalled();
});

test("shows a toast and stays open on invalid credentials", async () => {
  const add = spyOn(toastManager, "add");
  const user = await setup();
  await user.type(screen.getByLabelText("Nom d'utilisateur"), "admin");
  await user.type(screen.getByLabelText("Mot de passe"), "wrong");
  await user.click(screen.getByRole("button", { name: "Connexion" }));
  await waitFor(() => expect(add).toHaveBeenCalled());
  expect(add.mock.calls[0][0]).toMatchObject({
    description: "Identifiants invalides",
  });
  expect(screen.getByRole("dialog")).toBeTruthy();
  add.mockRestore();
});

test("sends basic credentials and closes on success", async () => {
  const create = route("POST /tokens", tokens);
  const user = await setup();
  await user.type(screen.getByLabelText("Nom d'utilisateur"), "admin");
  await user.type(screen.getByLabelText("Mot de passe"), "secret");
  await user.click(screen.getByRole("button", { name: "Connexion" }));
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull());
  expect(create.mock.calls[0][1].headers.get("authorization")).toBe(
    `Basic ${btoa("admin:secret")}`,
  );
});
