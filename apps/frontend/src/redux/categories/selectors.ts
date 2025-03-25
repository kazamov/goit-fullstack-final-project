import type { RootState } from '../store';

export const selectCategories = (state: RootState) => state.categories.items;
export const selectCategoriesLoading = (state: RootState) =>
  state.categories.loading;
export const selectCategoriesError = (state: RootState) =>
  state.categories.error;
export const selectCurrentCategory = (state: RootState) =>
  state.categories.currentCategory;
