import { TrashIcon, UploadSimpleIcon } from "@phosphor-icons/react";
import { type ComponentProps, useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { image } from "@/lib/image";
import { Button } from "./Button";

export function Upload({
  className,
  value,
  onValueChange,
  accept = "image/jpeg,image/png,image/webp",
  ...props
}: Omit<
  ComponentProps<"input">,
  "type" | "value" | "onChange" | "onValueChange"
> & {
  value?: File | string | null;
  onValueChange?: (file: File | null) => void;
}) {
  const [previewUrl, setPreviewUrl] = useState<string>();

  useEffect(() => {
    if (!(value instanceof File)) {
      setPreviewUrl(undefined);
      return;
    }
    const url = URL.createObjectURL(value);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [value]);

  const src =
    previewUrl ?? image(typeof value === "string" ? value : undefined);

  return (
    <div className={cn("relative h-32 w-full", className)}>
      <label className="flex size-full cursor-pointer items-center justify-center overflow-hidden rounded-xl bg-surface text-muted hover:opacity-80 has-focus-visible:outline-2 has-focus-visible:outline-offset-4 has-focus-visible:outline-fg">
        {src ? (
          <img alt="" src={src} className="size-full object-contain" />
        ) : (
          <UploadSimpleIcon className="size-6" />
        )}
        <input
          type="file"
          accept={accept}
          className="sr-only"
          onChange={(e) => {
            onValueChange?.(e.target.files?.item(0) ?? null);
            e.target.value = "";
          }}
          {...props}
        />
      </label>
      {previewUrl && (
        <Button
          size="sm"
          className="absolute right-2 bottom-2"
          aria-label="Supprimer l'image"
          onClick={() => onValueChange?.(null)}
        >
          <TrashIcon />
        </Button>
      )}
    </div>
  );
}
