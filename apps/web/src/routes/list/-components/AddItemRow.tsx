import { PlusIcon } from "@phosphor-icons/react";
import { useListStore } from "@/hooks/useListStore";

export function AddItemRow() {
  const add = useListStore((state) => state.add);
  return (
    <button
      type="button"
      onClick={() => add("")}
      className="flex h-10 cursor-pointer flex-row items-center gap-4 text-md text-muted-fg"
    >
      <span className="flex size-6 shrink-0 items-center justify-center">
        <PlusIcon className="size-5" />
      </span>
      Ajouter un article
    </button>
  );
}
