import type { RootState } from '../store';

export const selectCategories = (state: RootState) =>
  state.persisted.categories.items;
export const selectCategoriesLoading = (state: RootState) =>
  state.persisted.categories.loading;
export const selectCategoriesError = (state: RootState) =>
  state.persisted.categories.error;
export const selectCurrentCategory = (state: RootState) =>
  state.persisted.categories.currentCategory;
