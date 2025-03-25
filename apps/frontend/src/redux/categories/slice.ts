import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { GetCategoryResponse } from '@goit-fullstack-final-project/schemas';

export interface SelectedCategory {
  id: string;
  name: string;
  description: string;
}

export interface Categories {
  items: GetCategoryResponse;
  loading: boolean;
  error: string | null;
  currentCategory: SelectedCategory | null;
}

const initialState: Categories = {
  items: [],
  currentCategory: null,
  loading: false,
  error: null,
};

export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, thunkAPI) => {
    try {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    selectCategory: (state, action) => {
      const { payload } = action;
      state.currentCategory = payload;
    },
    resetCategory: (state) => {
      state.currentCategory = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCategories.fulfilled,
        (state, action: PayloadAction<GetCategoryResponse>) => {
          state.loading = false;
          state.items = action.payload;
        },
      )
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { selectCategory, resetCategory } = categoriesSlice.actions;
export const categoriesReducer = categoriesSlice.reducer;
export type CategoriesState = ReturnType<typeof categoriesReducer>;
export type fetchCategoriesAction = ReturnType<typeof fetchCategories>;
