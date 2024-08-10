import { getImageUrl } from "@/utils/getImageUrl";
import classNames from "classnames";
import { ImageOffIcon } from "lucide-react";

export interface ImageProps {
  className?: string;
  path?: string;
  alt?: string;
}

export const Image = ({ className, path, alt }: ImageProps) => {
  return path ? (
    <img className={className} src={getImageUrl(path)} alt={alt} />
  ) : (
    <div
      className={classNames(
        "flex justify-center items-center text-slate-400",
        className,
      )}
    >
      <ImageOffIcon />
    </div>
  );
};
