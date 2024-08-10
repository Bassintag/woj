export const getImageUrl = (path: string) => {
  const url = new URL(path, import.meta.env.PUBLIC_STORAGE_URL);
  return url.href;
};
