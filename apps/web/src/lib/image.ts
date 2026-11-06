export function image(path: string | undefined) {
  if (!path) return undefined;
  return new URL(path, import.meta.env.PUBLIC_IMAGES_URL).href;
}
