import { HTMLAttributes } from "react";
import classNames from "classnames";

export const Tag = ({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement>) => {
  return (
    <div
      className={classNames(
        "inline-flex flex-row gap-1 items-center bg-accent-100 text-accent-500 px-1.5 h-6 rounded-full text-xs font-semibold",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
