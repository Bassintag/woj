export const fetchApi = async <T>(path: string) => {
  const url = new URL(path, import.meta.env.PUBLIC_API_URL);
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
