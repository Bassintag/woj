import qs from "qs";

export interface FetchApiInit {
  query?: unknown;
}

export const fetchApi = async <T>(
  path: string,
  { query }: FetchApiInit = {},
) => {
  const url = new URL(path, import.meta.env.PUBLIC_API_URL);
  if (query) {
    url.search = qs.stringify(query);
  }
  const response = await fetch(url);
  const text = await response.text();
  if (!response.ok) {
    throw new Error(text);
  }
  if (text.length === 0) {
    return undefined as T;
  }
  return JSON.parse(text) as T;
};
