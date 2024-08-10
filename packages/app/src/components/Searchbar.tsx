import { Input, InputProps } from "@/components/Input";
import { useSearchParams } from "react-router-dom";
import { ChangeEvent, useCallback } from "react";
import debounce from "lodash.debounce";

export const Searchbar = (props: InputProps) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const handleChange = useCallback(
    debounce((e: ChangeEvent<HTMLInputElement>) => {
      setSearchParams(
        (prev) => {
          if (e.target.value) {
            prev.set("search", e.target.value);
          } else {
            prev.delete("search");
          }
          return prev;
        },
        { replace: true },
      );
    }, 500),
    [setSearchParams],
  );

  return (
    <Input
      {...props}
      defaultValue={searchParams.get("search") ?? undefined}
      onChange={handleChange}
    />
  );
};
