import { beforeEach, describe, expect, test } from "bun:test";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DrawerTrigger } from "@/components/ui/Drawer";
import { q } from "@/lib/orpc";
import { queryClient } from "@/lib/query";
import { installFakeApi, navigate, route } from "@/test/mocks";
import { renderWithProviders } from "@/test/render";
import {
  CreateRecipeFormDrawer,
  UpdateRecipeFormDrawer,
} from "./RecipeFormDrawer";

const gram = { id: 1, title: "g" };
const flour = {
  id: 10,
  title: "Farine",
  imageUrl: null,
  calories: 364,
  defaultUnit: gram,
  conversions: [],
};
const tags = [
  { id: 1, title: "Dessert" },
  { id: 2, title: "Rapide" },
];
const saved = { id: 5, title: "Gâteau", imageUrl: null };
const recipe = {
  id: 5,
  title: "Crêpes",
  imageUrl: "recipes/5.webp",
  calories: null,
  cookingTime: null,
  bakingTime: null,
  tagIds: [2],
  tags: [tags[1]],
  steps: [{ description: "Mélanger" }],
  constituents: [{ id: 1, quantity: 200, unit: gram, ingredient: flour }],
} as never;

installFakeApi();

beforeEach(() => {
  queryClient.clear();
  queryClient.setQueryData(q.tags.list.queryKey(), tags);
  queryClient.setQueryData(q.ingredients.list.queryKey(), [flour]);
});

async function open(ui: React.ReactElement) {
  renderWithProviders(ui);
  const user = userEvent.setup();
  await user.click(screen.getByText("Ouvrir"));
  await screen.findByRole("dialog");
  await screen.findByText("Dessert");
  return user;
}

function create() {
  return open(
    <CreateRecipeFormDrawer>
      <DrawerTrigger>Ouvrir</DrawerTrigger>
    </CreateRecipeFormDrawer>,
  );
}

function update() {
  return open(
    <UpdateRecipeFormDrawer recipe={recipe}>
      <DrawerTrigger>Ouvrir</DrawerTrigger>
    </UpdateRecipeFormDrawer>,
  );
}

function submit(user: ReturnType<typeof userEvent.setup>) {
  return user.click(screen.getByRole("button", { name: "Enregistrer" }));
}

describe("CreateRecipeFormDrawer", () => {
  test("requires a title and a step description", async () => {
    const post = route("POST /recipes", saved);
    const user = await create();
    await submit(user);
    expect((await screen.findAllByText(/too small/i)).length).toBe(2);
    expect(post).not.toHaveBeenCalled();
  });

  test("adds and removes steps", async () => {
    const user = await create();
    expect(
      screen.queryByRole("button", { name: "Supprimer l'étape" }),
    ).toBeNull();
    await user.click(screen.getByRole("button", { name: "Ajouter une étape" }));
    expect(screen.getAllByPlaceholderText("Instructions").length).toBe(2);
    await user.click(
      screen.getAllByRole("button", { name: "Supprimer l'étape" })[0],
    );
    expect(screen.getAllByPlaceholderText("Instructions").length).toBe(1);
  });

  test("creates the recipe with tags and steps then navigates", async () => {
    const post = route("POST /recipes", saved);
    const user = await create();
    await user.type(
      screen.getByPlaceholderText("Titre de la recette"),
      "Gâteau",
    );
    await user.click(screen.getByText("Rapide"));
    await user.type(screen.getByPlaceholderText("Instructions"), "Cuire");
    await submit(user);
    await waitFor(() =>
      expect(navigate).toHaveBeenCalledWith({ to: "/$id", params: { id: 5 } }),
    );
    expect(post.mock.calls[0][0]).toEqual({
      title: "Gâteau",
      tagIds: [2],
      constituents: [],
      steps: [{ description: "Cuire" }],
    });
  });

  test("uploads the selected image after creating the recipe", async () => {
    route("POST /recipes", saved);
    const upload = route("PUT /images/recipes/5", {
      imageUrl: "recipes/5.webp",
    });
    const user = await create();
    await user.type(
      screen.getByPlaceholderText("Titre de la recette"),
      "Gâteau",
    );
    await user.type(screen.getByPlaceholderText("Instructions"), "Cuire");
    const file = new File(["x"], "photo.png", { type: "image/png" });
    await user.upload(screen.getByLabelText("Ajouter une image"), file);
    await submit(user);
    await waitFor(() => expect(upload).toHaveBeenCalled());
    expect(navigate).toHaveBeenCalled();
  });

  test("does not upload without an image", async () => {
    route("POST /recipes", saved);
    const upload = route("PUT /images/recipes/5", {});
    const user = await create();
    await user.type(
      screen.getByPlaceholderText("Titre de la recette"),
      "Gâteau",
    );
    await user.type(screen.getByPlaceholderText("Instructions"), "Cuire");
    await submit(user);
    await waitFor(() => expect(navigate).toHaveBeenCalled());
    expect(upload).not.toHaveBeenCalled();
  });

  test("has no delete button", async () => {
    await create();
    expect(screen.queryByRole("button", { name: "Supprimer" })).toBeNull();
  });
});

describe("UpdateRecipeFormDrawer", () => {
  test("prefills the form and updates the recipe", async () => {
    const patch = route("PATCH /recipes/5", saved);
    const user = await update();
    const title = screen.getByPlaceholderText(
      "Titre de la recette",
    ) as HTMLInputElement;
    expect(title.value).toBe("Crêpes");
    expect(screen.getByText("Rapide").getAttribute("aria-checked")).toBe(
      "true",
    );
    expect(screen.getByText("Farine")).toBeTruthy();
    await user.type(title, " sucrées");
    await submit(user);
    await waitFor(() => expect(patch).toHaveBeenCalled());
    expect(patch.mock.calls[0][0]).toMatchObject({
      title: "Crêpes sucrées",
      tagIds: [2],
      constituents: [{ ingredientId: 10, unitId: 1, quantity: 200 }],
      steps: [{ description: "Mélanger" }],
    });
  });

  test("removes an ingredient", async () => {
    const user = await update();
    await user.click(
      screen.getByRole("button", { name: "Supprimer l'ingrédient" }),
    );
    expect(screen.queryByText("Farine")).toBeNull();
  });

  test("deletes the recipe after confirmation", async () => {
    const remove = route("DELETE /recipes/5");
    const user = await update();
    await user.click(screen.getByRole("button", { name: "Supprimer" }));
    expect(
      await screen.findByText(/« Crêpes » sera définitivement supprimée/),
    ).toBeTruthy();
    await user.click(await screen.findByRole("button", { name: "Supprimer" }));
    await waitFor(() => expect(navigate).toHaveBeenCalledWith({ to: "/" }));
    expect(remove).toHaveBeenCalled();
  });
});
