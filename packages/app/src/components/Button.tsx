import { ButtonHTMLAttributes, forwardRef } from "react";
import classNames from "classnames";

export const buttonColorSchemes = {
  black: "bg-black hover:bg-stone-800 active:bg-stone-700 text-white",
  white:
    "bg-white hover:bg-stone-100 active:bg-stone-200 disabled:bg-stone-200 text-stone-900",
};

export const buttonSizes = {
  sm: "h-6 px-2 text-xs [&>svg]:size-3 [&>svg:first-child]:-ml-0.5 [&>svg:last-child]:-mr-0.5",
  md: "h-10 px-4 text-sm [&>svg]:size-5 [&>svg:first-child]:-ml-1 [&>svg:last-child]:-mr-1",
  lg: "h-12 px-6 [&>svg]:size-6 [&>svg:first-child]:-ml-6 [&>svg:last-child]:-mr-6",
};

export type ButtonColorScheme = keyof typeof buttonColorSchemes;
export type ButtonSize = keyof typeof buttonSizes;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  colorScheme?: ButtonColorScheme;
  size?: ButtonSize;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { colorScheme = "black", size = "md", className, children, ...rest },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        className={classNames(
          "rounded-full font-medium transition inline-flex flex-row gap-1.5 items-center justify-center disabled:opacity-50",
          buttonColorSchemes[colorScheme],
          buttonSizes[size],
          className,
        )}
        {...rest}
      >
        {children}
      </button>
    );
  },
);
