import { Autocomplete as BaseAutocomplete } from "@base-ui/react/autocomplete";
import { useVirtualizer, type Virtualizer } from "@tanstack/react-virtual";
import {
  type ReactNode,
  type RefObject,
  useCallback,
  useImperativeHandle,
  useRef,
} from "react";
import { cn } from "@/lib/cn";
import { type InputVariantProps, inputVariants } from "./Input";

export const Autocomplete = BaseAutocomplete.Root;

export function AutocompleteInput({
  className,
  size,
  ...props
}: Omit<BaseAutocomplete.Input.Props, "size"> & InputVariantProps) {
  return (
    <BaseAutocomplete.Input
      className={cn("w-full", inputVariants({ size }), className)}
      {...props}
    />
  );
}

export function AutocompleteContent({
  className,
  children,
  ...props
}: BaseAutocomplete.Popup.Props) {
  return (
    <BaseAutocomplete.Portal>
      <BaseAutocomplete.Positioner className="z-50 outline-none" sideOffset={8}>
        <BaseAutocomplete.Popup
          className={cn(
            "max-h-(--available-height) w-(--anchor-width) origin-(--transform-origin) overflow-y-auto rounded-xl bg-surface text-md text-fg shadow-base transition-opacity data-ending-style:opacity-0 data-starting-style:opacity-0 motion-reduce:transition-none",
            className,
          )}
          {...props}
        >
          {children}
        </BaseAutocomplete.Popup>
      </BaseAutocomplete.Positioner>
    </BaseAutocomplete.Portal>
  );
}

export const AutocompleteList = BaseAutocomplete.List;

export function AutocompleteItem({
  className,
  ...props
}: BaseAutocomplete.Item.Props) {
  return (
    <BaseAutocomplete.Item
      className={cn(
        "flex h-8 cursor-pointer items-center gap-3 px-4 data-highlighted:bg-bg",
        className,
      )}
      {...props}
    />
  );
}

export type AutocompleteVirtualizer = Virtualizer<HTMLDivElement, Element>;

export function AutocompleteVirtualList<Item>({
  itemSize,
  virtualizerRef,
  onItemClick,
  children,
}: {
  itemSize: number;
  virtualizerRef?: RefObject<AutocompleteVirtualizer | null>;
  onItemClick?: (item: Item) => void;
  children: (item: Item) => ReactNode;
}) {
  const items = BaseAutocomplete.useFilteredItems<Item>();
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => itemSize,
    overscan: 8,
  });
  const setScroll = useCallback(
    (element: HTMLDivElement | null) => {
      scrollRef.current = element;
      if (element) virtualizer.measure();
    },
    [virtualizer],
  );

  useImperativeHandle(virtualizerRef, () => virtualizer);

  if (items.length === 0) return null;

  return (
    <div
      ref={setScroll}
      role="presentation"
      className="max-h-[min(20rem,var(--available-height))] overflow-auto overscroll-contain"
    >
      <div
        role="presentation"
        className="relative w-full"
        style={{ height: virtualizer.getTotalSize() }}
      >
        {virtualizer.getVirtualItems().map((row) => {
          const item = items[row.index] as Item;
          return (
            <AutocompleteItem
              key={row.key}
              index={row.index}
              data-index={row.index}
              value={item}
              aria-setsize={items.length}
              aria-posinset={row.index + 1}
              className="absolute top-0 left-0 w-full"
              style={{
                height: row.size,
                transform: `translateY(${row.start}px)`,
              }}
              onClick={() => onItemClick?.(item)}
            >
              {children(item)}
            </AutocompleteItem>
          );
        })}
      </div>
    </div>
  );
}

export function AutocompleteEmpty({
  className,
  ...props
}: BaseAutocomplete.Empty.Props) {
  return (
    <BaseAutocomplete.Empty
      className={cn("px-4 py-2 text-md text-muted empty:hidden", className)}
      {...props}
    />
  );
}
