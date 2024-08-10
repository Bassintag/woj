import { HTMLAttributes } from "react";
import classNames from "classnames";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {}

export const Card = ({ className, children, ...rest }: CardProps) => {
  return (
    <div className={classNames("p-3 bg-white rounded-lg", className)} {...rest}>
      {children}
    </div>
  );
};
