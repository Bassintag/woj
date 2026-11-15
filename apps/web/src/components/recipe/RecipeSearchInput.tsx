import { MagnifyingGlassIcon } from "@phosphor-icons/react";
import { debounce } from "es-toolkit";
import { type ChangeEvent, useMemo } from "react";
import { InputGroup, InputGroupInput } from "@/components/ui/InputGroup";

export function RecipeSearchInput({
  className,
  defaultValue,
  onSearch,
}: {
  className?: string;
  defaultValue?: string | null;
  onSearch: (value: string) => void;
}) {
  const onChange = useMemo(() => {
    return debounce((e: ChangeEvent<HTMLInputElement>) => {
      onSearch(e.target.value);
    }, 500);
  }, [onSearch]);

  return (
    <InputGroup className={className}>
      <MagnifyingGlassIcon />
      <InputGroupInput
        placeholder="Rechercher"
        defaultValue={defaultValue ?? ""}
        onChange={onChange}
      />
    </InputGroup>
  );
}
