import type { RecipeQuery } from '@goit-fullstack-final-project/schemas';

export function buildQueryString(query: RecipeQuery): string {
  return new URLSearchParams(
    Object.entries(query).reduce(
      (acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = String(value);
        }
        return acc;
      },
      {} as Record<string, string>,
    ),
  ).toString();
}
