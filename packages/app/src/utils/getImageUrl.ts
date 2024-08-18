const imagesUrl =
  import.meta.env.PUBLIC_IMAGES_URL ??
  `${window.location.protocol}//${window.location.host}`;
const pathPrefix = import.meta.env.PUBLIC_IMAGES_PATH_PREFIX || "";

export const getImageUrl = (path: string) => {
  const url = new URL(`${pathPrefix}${path}`, imagesUrl);
  return url.href;
};
