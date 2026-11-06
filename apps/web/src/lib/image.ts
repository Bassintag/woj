export function image(path: string | undefined) {
  if (!path) return undefined;
  return new URL(path, `${window.location.origin}/images/`).href;
}
