import { ShoppingItem } from "@/features/shoppingList/domain/ShoppingItem";
import { GripVerticalIcon, XIcon } from "lucide-react";
import { Image } from "@/components/Image";
import { useUpdateShoppingItem } from "@/features/shoppingList/hooks/useUpdateShoppingItem";
import { useIdParam } from "@/hooks/useIdParam";
import { useCallback, useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
import { useDeleteShoppingItem } from "@/features/shoppingList/hooks/useDeleteShoppingItem";
import classNames from "classnames";
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useSetShoppingItemIndex } from "@/features/shoppingList/hooks/useSetShoppingItemIndex";
import { Checkbox } from "@/components/Checkbox";

export interface ShoppingItemListProps {
  items: ShoppingItem[];
}

export const ShoppingItemList = ({ items }: ShoppingItemListProps) => {
  const [localItems, setLocalItems] = useState(items);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  const shoppingListId = useIdParam();
  const { mutate: setShoppingItemIndex } = useSetShoppingItemIndex();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over == null) return;
    const id = active.id as number;
    const from = items.findIndex((item) => item.id === active.id);
    if (from < 0) return;
    const to = items.findIndex((item) => item.id === over.id);
    if (to < 0) return;
    if (from === to) return;
    setShoppingItemIndex({ id, shoppingListId, index: to });
    setLocalItems((items) => arrayMove(items, from, to));
  };

  return (
    <ol className="flex flex-col">
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext
          items={localItems}
          strategy={verticalListSortingStrategy}
        >
          {localItems.map((item) => (
            <ShoppingListRow key={item.id} item={item} />
          ))}
        </SortableContext>
      </DndContext>
    </ol>
  );
};

export interface ShoppingItemListRowProps {
  item: ShoppingItem;
}

export const ShoppingListRow = ({ item }: ShoppingItemListRowProps) => {
  const { mutate: updateShoppingItem } = useUpdateShoppingItem();
  const { mutate: deleteShoppingItem } = useDeleteShoppingItem();
  const id = useIdParam();
  const {
    setNodeRef,
    isDragging,
    attributes,
    listeners,
    transform,
    transition,
  } = useSortable({ id: item.id });

  if (transform) {
    transform.scaleY = 1;
  }

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={classNames(
        "bg-white py-1.5 rounded-lg group transition-colors",
        {
          "lg:hover:bg-stone-100": !isDragging,
          "shadow-lg z-10 lg:bg-stone-50 cursor-grabbing": isDragging,
        },
      )}
    >
      <div className="min-h-7 flex flex-row items-center gap-1.5 container">
        <GripVerticalIcon
          {...attributes}
          {...listeners}
          className={classNames(
            "text-stone-400 size-5 shrink-0 lg:opacity-0 group-hover:opacity-100 transition",
            {
              "cursor-grab": !isDragging,
              "cursor-grabbing": isDragging,
            },
          )}
        />
        <Checkbox
          checked={item.purchased}
          onCheckedChange={(checked) => {
            updateShoppingItem({
              id: item.id,
              shoppingListId: id,
              purchased: checked as boolean,
            });
          }}
          className="shrink-0 size-5 border-2 rounded flex items-center justify-center aria-checked:bg-stone-500 aria-checked:border-stone-500 aria-checked:text-white transition"
        />
        {item.ingredient?.imagePath && (
          <Image className="size-8 rounded" path={item.ingredient.imagePath} />
        )}
        <ShoppingItemListInput item={item} />
        <button
          className="text-stone-400 active:text-stone-600 lg:opacity-0 group-hover:opacity-100 transition"
          onClick={() =>
            deleteShoppingItem({
              id: item.id,
              shoppingListId: id,
            })
          }
        >
          <XIcon className="size-5" />
        </button>
      </div>
    </li>
  );
};

const ShoppingItemListInput = ({ item }: ShoppingItemListRowProps) => {
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const { mutate: updateShoppingItem } = useUpdateShoppingItem();
  const id = useIdParam();

  useEffect(() => {
    if (!ref.current || ref.current.textContent) return;
    ref.current.textContent = item.name;
    if (item.name == null) {
      ref.current.focus();
    }
  }, [ref, item.name]);

  const handleChange = useCallback(
    debounce((element: HTMLElement) => {
      const parts: string[] = [];
      for (let i = 0; i < element.childNodes.length; i += 1) {
        const node = element.childNodes.item(i);
        if (node.nodeType === Node.TEXT_NODE) {
          parts.push(node.textContent ?? "");
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          parts.push("\n");
        }
      }
      const content = parts.join("");
      updateShoppingItem({
        id: item.id,
        shoppingListId: id,
        name: content,
      });
    }, 500),
    [updateShoppingItem, item.id, id],
  );

  return (
    <p
      ref={ref}
      contentEditable
      dir="ltr"
      aria-multiline
      spellCheck={isFocused}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{ overflowWrap: "anywhere" }}
      className={classNames(
        "grow text-sm outline-none text-wrap whitespace-pre-wrap",
        { "line-through opacity-50": item.purchased },
      )}
      onInput={(e) => handleChange(e.currentTarget)}
    />
  );
};
