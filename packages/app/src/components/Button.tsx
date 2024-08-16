import { ButtonHTMLAttributes } from "react";
import classNames from "classnames";

export const buttonVariants = {
  solid: {
    base: "rounded-full bg-black text-white hover:bg-stone-800 active:bg-stone-700 font-medium",
    sizes: {
      md: "h-10 px-4 text-sm",
      lg: "h-12 px-6",
    },
  },
  icon: {
    base: "rounded-full bg-white hover:bg-stone-100 active:bg-stone-200 disabled:bg-stone-200 text-stone-900 [&>*]:size-4",
    sizes: {
      md: "size-7 [&>*]:size-4",
      lg: "size-12 [&>*]:size-6",
    },
  },
};

export type ButtonVariant = keyof typeof buttonVariants;
export type ButtonSize = keyof (typeof buttonVariants)[ButtonVariant]["sizes"];

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export const Button = ({
  variant = "solid",
  size = "md",
  className,
  children,
  ...rest
}: ButtonProps) => {
  return (
    <button
      className={classNames(
        "transition inline-flex flex-row gap-1.5 items-center justify-center disabled:opacity-50",
        buttonVariants[variant].base,
        buttonVariants[variant].sizes[size],
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
};
