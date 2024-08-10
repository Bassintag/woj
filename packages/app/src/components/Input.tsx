import { forwardRef, InputHTMLAttributes } from "react";
import classNames from "classnames";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...rest }, ref) => {
    return (
      <input
        ref={ref}
        className={classNames(
          "h-8 px-4 rounded-lg bg-slate-100 focus:bg-slate-50 text-slate-600 focus:text-slate-500 outline-none transition",
          className,
        )}
        {...rest}
      />
    );
  },
);
