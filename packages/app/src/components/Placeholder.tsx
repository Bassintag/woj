import { LucideIcon } from "lucide-react";

export interface PlaceholderProps {
  label: string;
  icon: LucideIcon;
}

export const Placeholder = ({ label, icon: Icon }: PlaceholderProps) => {
  return (
    <div className="flex flex-col items-center gap-3 text-stone-300 mt-16 max-w-64 mx-auto">
      <Icon className="size-12" />
      <p className="font-semibold text-sm text-center">{label}</p>
    </div>
  );
};
