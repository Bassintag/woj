const APP_NAME = "WOJ";

export function pageTitle(title?: string) {
  return title ? `${title} · ${APP_NAME}` : APP_NAME;
}
