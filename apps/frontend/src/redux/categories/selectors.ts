import { createSelector } from '@reduxjs/toolkit';

import type { RootState } from '../store';

import type { SelectedCategory } from './slice';

export const selectCategories = (state: RootState) => state.categories.items;

const ALL_CATEGORIES: SelectedCategory = {
  id: '',
  name: 'All Categories',
  description: 'Recipes by All Categories',
};

export const createCategorySelector = (id: string | null) => {
  return createSelector([selectCategories], (categories) => {
    return categories.find((category) => category.id === id) ?? ALL_CATEGORIES;
  });
};
