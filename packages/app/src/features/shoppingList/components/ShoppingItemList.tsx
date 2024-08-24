import { ShoppingItem } from "@/features/shoppingList/domain/ShoppingItem";
import { GripVerticalIcon, XIcon } from "lucide-react";
import { Image } from "@/components/Image";
import { useStringIdParam } from "@/hooks/useIdParam";
import { useCallback, useEffect, useRef, useState } from "react";
import debounce from "lodash.debounce";
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
import { Checkbox } from "@/components/Checkbox";
import { useShoppingListsState } from "@/features/shoppingList/hooks/useShoppingListsState";
import { useShoppingList } from "@/features/shoppingList/hooks/useShoppingList";

export interface ShoppingItemListProps {
  items: ShoppingItem[];
}

export const ShoppingItemList = ({ items }: ShoppingItemListProps) => {
  const listId = useStringIdParam();
  const shoppingList = useShoppingList(listId);
  const setItems = useShoppingListsState((s) => s.setItems);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: DragEndEvent) => {
    if (shoppingList == null) return;
    const { active, over } = event;
    if (over == null) return;
    const id = active.id as number;
    const from = items.findIndex((item) => item.id === active.id);
    if (from < 0) return;
    const to = items.findIndex((item) => item.id === over.id);
    if (to < 0) return;
    if (from === to) return;
    setItems(listId, arrayMove(shoppingList.items, from, to));
  };

  return (
    shoppingList && (
      <ol className="flex flex-col">
        <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
          <SortableContext
            items={shoppingList.items}
            strategy={verticalListSortingStrategy}
          >
            {shoppingList.items.map((item) => (
              <ShoppingListRow key={item.id} item={item} />
            ))}
          </SortableContext>
        </DndContext>
      </ol>
    )
  );
};

export interface ShoppingItemListRowProps {
  item: ShoppingItem;
}

export const ShoppingListRow = ({ item }: ShoppingItemListRowProps) => {
  const [setItem, deleteItem] = useShoppingListsState((s) => [
    s.setItem,
    s.deleteItem,
  ]);
  const listId = useStringIdParam();
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
            "text-stone-400 size-5 shrink-0 lg:opacity-0 group-hover:opacity-100 touch-none transition",
            {
              "cursor-grab": !isDragging,
              "cursor-grabbing": isDragging,
            },
          )}
        />
        <Checkbox
          checked={item.purchased}
          onCheckedChange={(checked) => {
            setItem(listId, item.id, {
              ...item,
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
          onClick={() => deleteItem(listId, item.id)}
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
  const setItem = useShoppingListsState((s) => s.setItem);
  const listId = useStringIdParam();

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
      setItem(listId, item.id, { ...item, name: content });
    }, 500),
    [setItem, item.id, listId],
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
