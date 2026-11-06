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

  return (
    <div className="flex h-10 flex-row items-center gap-4">
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
      <input
        key={item.label}
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
          const filled = event.currentTarget.value.trim() !== "";
          event.currentTarget.blur();
          if (last && filled) add("");
        }}
        className={cn(
          "min-w-0 flex-1 bg-transparent text-md text-fg focus-visible:outline-none",
          item.checked && "text-muted-fg line-through",
        )}
      />
    </div>
  );
}
