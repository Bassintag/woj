import { FloppyDiskIcon, PlusIcon, TrashIcon } from "@phosphor-icons/react";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  type CreateRecipe,
  CreateRecipeSchema,
  type Ingredient,
  type RecipeDetail,
} from "@woj/contract";
import { uniqBy } from "es-toolkit";
import { type PropsWithChildren, Suspense, useRef, useState } from "react";
import { z } from "zod";
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteInput,
  type AutocompleteVirtualizer,
  AutocompleteVirtualList,
} from "@/components/ui/Autocomplete";
import { Button } from "@/components/ui/Button";
import { ConfirmDrawer } from "@/components/ui/ConfirmDrawer";
import {
  Drawer,
  DrawerActions,
  DrawerContent,
  DrawerHeader,
  DrawerPopup,
  DrawerTitle,
} from "@/components/ui/Drawer";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupNumberInput,
} from "@/components/ui/InputGroup";
import { NumberInputRoot } from "@/components/ui/NumberInput";
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/Select";
import { Skeleton } from "@/components/ui/Skeleton";
import { Tag, TagGroup } from "@/components/ui/Tag";
import { useAppForm, useFormContext } from "@/hooks/useAppForm";
import { image } from "@/lib/image";
import { orpc, q } from "@/lib/orpc";
import { queryClient } from "@/lib/query";

const RecipeFormSchema = CreateRecipeSchema.extend({
  image: z.union([z.file(), z.string()]).nullable(),
});

type RecipeFormValues = z.input<typeof RecipeFormSchema>;

const defaultValues: RecipeFormValues = {
  image: null,
  title: "",
  tagIds: [],
  constituents: [],
  steps: [{ description: "" }],
};

function useRecipeForm(
  onSubmit: (values: RecipeFormValues) => Promise<unknown>,
  initialValues?: RecipeFormValues,
) {
  const form = useAppForm({
    defaultValues: initialValues ?? defaultValues,
    validators: { onSubmit: RecipeFormSchema },
    async onSubmit({ value }) {
      await onSubmit(value);
      form.reset();
    },
  });
  return form;
}

type RecipeForm = ReturnType<typeof useRecipeForm>;

function useRecipeFormContext() {
  return useFormContext() as unknown as RecipeForm;
}

function getUnits(ingredient: Ingredient) {
  return uniqBy(
    [ingredient.defaultUnit, ...ingredient.conversions.map((c) => c.unit)],
    (unit) => unit.id,
  );
}

function RecipeNumberField({
  name,
  label,
  unit,
}: {
  name: "cookingTime" | "bakingTime" | "calories";
  label: string;
  unit: string;
}) {
  const form = useRecipeFormContext();

  return (
    <form.AppField name={name}>
      {(field) => (
        <field.Root label={label}>
          <NumberInputRoot
            value={field.state.value}
            onValueChange={field.handleChange}
            min={0}
            step="any"
          >
            <InputGroup>
              <InputGroupNumberInput onBlur={field.handleBlur} />
              <InputGroupAddon>{unit}</InputGroupAddon>
            </InputGroup>
          </NumberInputRoot>
        </field.Root>
      )}
    </form.AppField>
  );
}

function RecipeTagsField() {
  const form = useRecipeFormContext();
  const tags = useSuspenseQuery(q.tags.list.queryOptions());

  return (
    <form.AppField name="tagIds">
      {(field) => (
        <field.Root label="Tags">
          <TagGroup
            className="flex flex-row flex-wrap gap-3"
            value={field.state.value.map(String)}
            onValueChange={(value) => field.handleChange(value.map(Number))}
          >
            {tags.data.map((tag) => (
              <Tag key={tag.id} value={tag.id.toFixed(0)}>
                {tag.title}
              </Tag>
            ))}
          </TagGroup>
        </field.Root>
      )}
    </form.AppField>
  );
}

function RecipeIngredientsField() {
  const form = useRecipeFormContext();
  const ingredients = useSuspenseQuery(q.ingredients.list.queryOptions());
  const [search, setSearch] = useState("");
  const [addedId, setAddedId] = useState<number>();
  const virtualizerRef = useRef<AutocompleteVirtualizer | null>(null);
  const ingredientsById = new Map(
    ingredients.data.map((ingredient) => [ingredient.id, ingredient]),
  );

  return (
    <form.AppField name="constituents" mode="array">
      {(field) => {
        const available = ingredients.data.filter(
          (ingredient) =>
            !field.state.value.some((c) => c.ingredientId === ingredient.id),
        );

        return (
          <field.Root label="Ingrédients">
            <Autocomplete
              virtualized
              items={available}
              onItemHighlighted={(item, { reason, index }) => {
                const virtualizer = virtualizerRef.current;
                if (!item || !virtualizer) return;
                const isStart = index === 0;
                const isEnd = index === virtualizer.options.count - 1;
                if (
                  reason === "none" ||
                  (reason === "keyboard" && (isStart || isEnd))
                ) {
                  queueMicrotask(() =>
                    virtualizer.scrollToIndex(index, {
                      align: isEnd ? "start" : "end",
                    }),
                  );
                }
              }}
              value={search}
              onValueChange={(value, details) =>
                setSearch(details.reason === "item-press" ? "" : value)
              }
              itemToStringValue={(ingredient) => ingredient.title}
            >
              <AutocompleteInput placeholder="Ajouter un ingrédient" />
              <AutocompleteContent>
                <AutocompleteEmpty>Aucun résultat</AutocompleteEmpty>
                <AutocompleteVirtualList<Ingredient>
                  itemSize={48}
                  virtualizerRef={virtualizerRef}
                  onItemClick={(ingredient) => {
                    setAddedId(ingredient.id);
                    field.pushValue({
                      ingredientId: ingredient.id,
                      unitId: ingredient.defaultUnit.id,
                      quantity: 1,
                    });
                  }}
                >
                  {(ingredient) => (
                    <>
                      <img
                        alt=""
                        loading="lazy"
                        src={image(ingredient.imageUrl ?? undefined)}
                        className="size-8 shrink-0 rounded-lg bg-bg object-cover"
                      />
                      <span className="truncate">{ingredient.title}</span>
                    </>
                  )}
                </AutocompleteVirtualList>
              </AutocompleteContent>
            </Autocomplete>
            {field.state.value.map(({ ingredientId }, index) => {
              const ingredient = ingredientsById.get(ingredientId);
              if (!ingredient) return null;
              return (
                <div key={ingredientId} className="flex flex-row gap-4">
                  <img
                    alt=""
                    src={image(ingredient.imageUrl ?? undefined)}
                    className="size-14 shrink-0 rounded-xl bg-surface object-cover"
                  />
                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <span className="truncate text-md text-fg">
                      {ingredient.title}
                    </span>
                    <div className="flex flex-row items-center gap-2">
                      <form.AppField name={`constituents[${index}].quantity`}>
                        {(quantityField) => (
                          <div className="min-w-0 flex-1">
                            <quantityField.NumberInputField
                              autoFocus={ingredientId === addedId}
                              size="sm"
                              min={0}
                              step="any"
                              placeholder="Qty"
                              className="w-full"
                            />
                          </div>
                        )}
                      </form.AppField>
                      <form.AppField name={`constituents[${index}].unitId`}>
                        {(unitField) => (
                          <div className="min-w-0 flex-1">
                            <unitField.Select
                              size="sm"
                              items={getUnits(ingredient).map((unit) => ({
                                value: unit.id,
                                label: unit.title,
                              }))}
                            >
                              <SelectTrigger placeholder="Unit" />
                              <SelectContent>
                                {getUnits(ingredient).map((unit) => (
                                  <SelectItem key={unit.id} value={unit.id}>
                                    {unit.title}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </unitField.Select>
                          </div>
                        )}
                      </form.AppField>
                      <Button
                        variant="ghost"
                        size="sm"
                        aria-label="Supprimer l'ingrédient"
                        onClick={() => field.removeValue(index)}
                      >
                        <TrashIcon />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </field.Root>
        );
      }}
    </form.AppField>
  );
}

function RecipeStepsField() {
  const form = useRecipeFormContext();
  return (
    <form.AppField name="steps" mode="array">
      {(field) => (
        <field.Root label="Étapes">
          {field.state.value.map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: steps have no identity
            <div key={index} className="flex flex-col gap-2">
              <div className="flex flex-row items-center justify-between">
                <span className="text-xs text-muted uppercase">
                  Étape {index + 1}
                </span>
                {field.state.value.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    aria-label="Supprimer l'étape"
                    onClick={() => field.removeValue(index)}
                  >
                    <TrashIcon />
                  </Button>
                )}
              </div>
              <form.AppField name={`steps[${index}].description`}>
                {(stepField) => (
                  <stepField.TextareaField placeholder="Instructions" />
                )}
              </form.AppField>
            </div>
          ))}
          <Button
            size="sm"
            onClick={() => field.pushValue({ description: "" })}
          >
            <PlusIcon />
            Ajouter une étape
          </Button>
        </field.Root>
      )}
    </form.AppField>
  );
}

function RecipeFormDrawer({
  title,
  initialValues,
  onSubmit,
  onDelete,
}: {
  title: string;
  initialValues?: RecipeFormValues;
  onSubmit: (values: RecipeFormValues) => Promise<unknown>;
  onDelete?: () => void;
}) {
  const form = useRecipeForm(onSubmit, initialValues);

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
      <DrawerContent className="flex flex-col gap-6">
        <form.AppForm>
          <form.AppField name="image">
            {(field) => (
              <field.Upload
                className="shrink-0"
                aria-label="Ajouter une image"
              />
            )}
          </form.AppField>
          <form.AppField name="title">
            {(field) => (
              <field.InputField
                label="Titre"
                placeholder="Titre de la recette"
              />
            )}
          </form.AppField>
          <div className="grid grid-cols-2 gap-4">
            <RecipeNumberField
              name="cookingTime"
              label="Préparation"
              unit="min"
            />
            <RecipeNumberField name="bakingTime" label="Cuisson" unit="min" />
          </div>
          <RecipeNumberField name="calories" label="Calories" unit="kcal" />
          <Suspense fallback={<Skeleton className="h-8" />}>
            <RecipeTagsField />
          </Suspense>
          <Suspense fallback={<Skeleton className="h-10" />}>
            <RecipeIngredientsField />
          </Suspense>
          <RecipeStepsField />
        </form.AppForm>
      </DrawerContent>
      <DrawerActions className="flex-row">
        {onDelete && (
          <Button aria-label="Supprimer" onClick={onDelete}>
            <TrashIcon />
          </Button>
        )}
        <form.AppForm>
          <form.SubmitButton type="submit" variant="brand" className="flex-1">
            <FloppyDiskIcon />
            Enregistrer
          </form.SubmitButton>
        </form.AppForm>
      </DrawerActions>
    </DrawerPopup>
  );
}

async function saveRecipe(
  { image, ...input }: RecipeFormValues,
  save: (input: CreateRecipe) => Promise<RecipeDetail>,
) {
  const recipe = await save(input);
  if (!(image instanceof File)) return recipe;
  const { imageUrl } = await orpc.images.upload({
    kind: "recipes",
    id: recipe.id,
    file: image,
  });
  return { ...recipe, imageUrl };
}

async function onRecipeSaved(data: RecipeDetail) {
  queryClient.setQueryData(
    q.recipes.get.queryKey({ input: { id: data.id } }),
    data,
  );
  await queryClient.invalidateQueries({ queryKey: q.recipes.list.key() });
}

export function CreateRecipeFormDrawer({ children }: PropsWithChildren) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const createRecipe = useMutation({
    mutationFn: (values: RecipeFormValues) =>
      saveRecipe(values, orpc.recipes.create),
    async onSuccess(data) {
      await onRecipeSaved(data);
      setOpen(false);
      await navigate({ to: "/$id", params: { id: data.id } });
    },
  });

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      {children}
      <RecipeFormDrawer
        title="Nouvelle recette"
        onSubmit={createRecipe.mutateAsync}
      />
    </Drawer>
  );
}

export function UpdateRecipeFormDrawer({
  children,
  recipe,
}: PropsWithChildren & { recipe: RecipeDetail }) {
  const [open, setOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();
  const deleteRecipe = useMutation({
    mutationFn: () => orpc.recipes.remove({ id: recipe.id }),
    async onSuccess() {
      queryClient.removeQueries({
        queryKey: q.recipes.get.queryKey({ input: { id: recipe.id } }),
      });
      await queryClient.invalidateQueries({ queryKey: q.recipes.list.key() });
      setConfirmOpen(false);
      await navigate({ to: "/" });
    },
  });
  const updateRecipe = useMutation({
    mutationFn: (values: RecipeFormValues) =>
      saveRecipe(values, (input) =>
        orpc.recipes.update({ id: recipe.id, ...input }),
      ),
    async onSuccess(data) {
      await onRecipeSaved(data);
      setOpen(false);
    },
  });

  return (
    <>
      <Drawer open={open} onOpenChange={setOpen}>
        {children}
        <RecipeFormDrawer
          title="Modifier la recette"
          initialValues={{
            ...recipe,
            image: recipe.imageUrl,
            constituents: recipe.constituents.map((constituent) => ({
              ingredientId: constituent.ingredient.id,
              unitId: constituent.unit.id,
              quantity: constituent.quantity,
            })),
          }}
          onSubmit={updateRecipe.mutateAsync}
          onDelete={() => {
            setOpen(false);
            setConfirmOpen(true);
          }}
        />
      </Drawer>
      <ConfirmDrawer
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Supprimer la recette"
        description={`« ${recipe.title} » sera définitivement supprimée.`}
        onConfirm={deleteRecipe.mutateAsync}
      />
    </>
  );
}
