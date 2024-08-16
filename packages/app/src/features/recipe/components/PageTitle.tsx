import { PropsWithChildren } from "react";
import { Sidebar } from "@/components/Sidebar";
import { Link } from "react-router-dom";
import { ArrowLeftIcon } from "lucide-react";

export interface PageTitleProps extends PropsWithChildren {
  linkTo?: string;
}

export const PageTitle = ({ linkTo, children }: PageTitleProps) => {
  return (
    <div className="flex flex-row gap-3 items-start max-sm:text-center max-sm:pr-9">
      <div className="mt-1">
        {linkTo ? (
          <Link to={linkTo}>
            <ArrowLeftIcon className="size-6" />
          </Link>
        ) : (
          <Sidebar />
        )}
      </div>
      <h1 className="font-medium text-2xl align-top text-stone-800">
        {children}
      </h1>
    </div>
  );
};
