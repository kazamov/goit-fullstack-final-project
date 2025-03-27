import type { RootState } from '../store';

export const selectAreas = (state: RootState) => state.areas.items;
export const selectIngredientsLoading = (state: RootState) =>
  state.areas.loading;
export const selectIngredientsError = (state: RootState) => state.areas.error;
