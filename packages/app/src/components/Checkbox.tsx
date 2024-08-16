import { CheckIcon } from "lucide-react";
import * as C from "@radix-ui/react-checkbox";
import classNames from "classnames";

export interface CheckboxProps extends C.CheckboxProps {}

export const Checkbox = ({ className, ...rest }: CheckboxProps) => {
  return (
    <C.Root
      className={classNames(
        "shrink-0 size-5 border-2 rounded flex items-center justify-center aria-checked:bg-black aria-checked:border-black aria-checked:text-white transition",
        className,
      )}
      {...rest}
    >
      <C.Indicator>
        <CheckIcon className="size-4 animate-in fade-in" />
      </C.Indicator>
    </C.Root>
  );
};
