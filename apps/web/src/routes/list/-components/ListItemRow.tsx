import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Checkbox } from "@/components/ui/Checkbox";
import { type ListItem, useListStore } from "@/hooks/useListStore";
import { cn } from "@/lib/cn";
import { image } from "@/lib/image";

export function ListItemRow({
  item,
  last,
}: {
  item: ListItem;
  last?: boolean;
}) {
  const toggle = useListStore((state) => state.toggle);
  const update = useListStore((state) => state.update);
  const add = useListStore((state) => state.add);

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id, disabled: item.checked });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      data-dragging={isDragging || undefined}
      className="relative flex min-h-10 touch-pan-y flex-row items-center gap-4 px-layout select-none data-dragging:z-10 data-dragging:bg-muted-bg data-dragging:**:cursor-grabbing"
    >
      <Checkbox
        aria-label={item.label}
        checked={item.checked}
        onCheckedChange={() => toggle(item.id)}
      />
      {item.image && (
        <img
          alt=""
          src={image(item.image)}
          className="size-10 shrink-0 rounded-sm bg-muted-bg object-cover"
        />
      )}
      <textarea
        key={item.label}
        rows={1}
        defaultValue={item.label}
        ref={(node) => {
          if (!item.label) node?.focus();
        }}
        onBlur={(event) => update(item.id, event.currentTarget.value.trim())}
        onKeyDown={(event) => {
          if (event.key === "Backspace" && !event.currentTarget.value) {
            event.currentTarget.blur();
          }
          if (event.key !== "Enter") return;
          event.preventDefault();
          const filled = event.currentTarget.value.trim() !== "";
          event.currentTarget.blur();
          if (last && filled) add("");
        }}
        className={cn(
          "field-sizing-content min-w-0 flex-1 resize-none bg-transparent py-2 text-md text-fg focus-visible:outline-none",
          item.checked && "text-muted-fg line-through",
        )}
      />
    </div>
  );
}
