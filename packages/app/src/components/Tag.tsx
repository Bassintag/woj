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
        "inline-flex flex-row gap-1.5 items-center bg-orange-100 text-orange-500 px-2 h-6 rounded-full text-xs font-semibold",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
};
