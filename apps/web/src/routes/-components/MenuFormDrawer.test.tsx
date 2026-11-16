import { beforeEach, describe, expect, test } from "bun:test";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DrawerTrigger } from "@/components/ui/Drawer";
import { queryClient } from "@/lib/query";
import { installFakeApi, navigate, route } from "@/test/mocks";
import { renderWithProviders } from "@/test/render";
import { CreateMenuFormDrawer, UpdateMenuFormDrawer } from "./MenuFormDrawer";

const menu = { id: 3, title: "Semaine 1", meals: [] } as never;

installFakeApi();

beforeEach(() => {
  queryClient.clear();
});

describe("CreateMenuFormDrawer", () => {
  function setup() {
    renderWithProviders(
      <CreateMenuFormDrawer>
        <DrawerTrigger>Ouvrir</DrawerTrigger>
      </CreateMenuFormDrawer>,
    );
    return userEvent.setup();
  }

  test("shows an error and does not submit when the title is empty", async () => {
    const create = route("POST /menus", {});
    const user = setup();
    await user.click(screen.getByText("Ouvrir"));
    await user.click(
      await screen.findByRole("button", { name: "Enregistrer" }),
    );
    expect(await screen.findByText(/too small/i)).toBeTruthy();
    expect(create).not.toHaveBeenCalled();
  });

  test("creates the menu then navigates to it", async () => {
    const create = route("POST /menus", { id: 7, title: "Nouveau", meals: [] });
    const user = setup();
    await user.click(screen.getByText("Ouvrir"));
    await user.type(await screen.findByLabelText("Titre"), "Nouveau");
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));
    await waitFor(() => expect(navigate).toHaveBeenCalled());
    expect(create.mock.calls[0][0]).toEqual({
      title: "Nouveau",
      meals: [],
    });
    expect(navigate).toHaveBeenCalledWith({
      to: "/menu/$id",
      params: { id: 7 },
    });
  });

  test("has no delete button", async () => {
    const user = setup();
    await user.click(screen.getByText("Ouvrir"));
    await screen.findByRole("dialog");
    expect(screen.queryByRole("button", { name: "Supprimer" })).toBeNull();
  });
});

describe("UpdateMenuFormDrawer", () => {
  function setup() {
    renderWithProviders(
      <UpdateMenuFormDrawer menu={menu}>
        <DrawerTrigger>Ouvrir</DrawerTrigger>
      </UpdateMenuFormDrawer>,
    );
    return userEvent.setup();
  }

  test("prefills the title and updates the menu", async () => {
    const update = route("PATCH /menus/3", {
      id: 3,
      title: "Semaine 2",
      meals: [],
    });
    const user = setup();
    await user.click(screen.getByText("Ouvrir"));
    const input = (await screen.findByLabelText("Titre")) as HTMLInputElement;
    expect(input.value).toBe("Semaine 1");
    await user.clear(input);
    await user.type(input, "Semaine 2");
    await user.click(screen.getByRole("button", { name: "Enregistrer" }));
    await waitFor(() => expect(update).toHaveBeenCalled());
    expect(update.mock.calls[0][0]).toEqual({ title: "Semaine 2" });
  });

  test("deletes the menu after confirmation", async () => {
    const remove = route("DELETE /menus/3");
    const user = setup();
    await user.click(screen.getByText("Ouvrir"));
    await user.click(await screen.findByRole("button", { name: "Supprimer" }));
    expect(
      await screen.findByText(/« Semaine 1 » sera définitivement supprimé/),
    ).toBeTruthy();
    await user.click(await screen.findByRole("button", { name: "Supprimer" }));
    await waitFor(() => expect(navigate).toHaveBeenCalledWith({ to: "/" }));
    expect(remove).toHaveBeenCalled();
  });
});
