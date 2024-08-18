import qs from "qs";

const apiUrl =
  import.meta.env.PUBLIC_API_URL ||
  `${window.location.protocol}//${window.location.host}`;
const pathPrefix = import.meta.env.PUBLIC_API_PATH_PREFIX || "";

export interface FetchApiInit {
  query?: unknown;
  method?: string;
  json?: unknown;
}

export const fetchApi = async <T>(
  path: string,
  { query, method, json }: FetchApiInit = {},
) => {
  const url = new URL(`${pathPrefix}${path}`, apiUrl);
  if (query) {
    url.search = qs.stringify(query);
  }
  const init: RequestInit = { method };
  if (json != null) {
    init.body = JSON.stringify(json);
    init.headers = { "Content-Type": "application/json" };
  }
  const response = await fetch(url, init);
  const text = await response.text();
  if (!response.ok) {
    throw new Error(text);
  }
  if (text.length === 0) {
    return undefined as T;
  }
  return JSON.parse(text) as T;
};
