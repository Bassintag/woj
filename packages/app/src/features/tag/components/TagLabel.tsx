import { Tag } from "@/features/tag/domain/Tag";
import { useMemo } from "react";
import classNames from "classnames";

export interface TagLabelProps {
  tag: Tag;
}

export const TagLabel = ({ tag }: TagLabelProps) => {
  const className = useMemo(() => {
    return colorSchemes[Math.abs(hash(tag.name)) % colorSchemes.length];
  }, [tag.name]);

  return (
    <div
      className={classNames(
        "inline-flex flex-row items-center px-2 h-6 text-xs rounded-full",
        className,
      )}
    >
      {tag.name}
    </div>
  );
};

const colorSchemes = [
  "bg-red-100 text-red-500",
  "bg-green-100 text-green-500",
  "bg-blue-100 text-blue-500",
  "bg-yellow-100 text-yellow-500",
  "bg-orange-100 text-orange-500",
  "bg-purple-100 text-purple-500",
  "bg-sky-100 text-sky-500",
  "bg-lime-100 text-lime-500",
];

const hash = (s: string) => {
  let hash = 0;
  let i;
  let chr;
  if (s.length === 0) return hash;
  for (i = 0; i < s.length; i++) {
    chr = s.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return hash;
};
