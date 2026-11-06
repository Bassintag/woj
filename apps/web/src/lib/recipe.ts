export function filterByTags<T extends { id: number }>(
  results: T[],
  tags: number[],
  get: (id: number) => { tags: { id: number }[] },
) {
  return results.filter((result) => {
    const recipe = get(result.id);
    return tags.some((id) => recipe.tags.some((tag) => tag.id === id));
  });
}
