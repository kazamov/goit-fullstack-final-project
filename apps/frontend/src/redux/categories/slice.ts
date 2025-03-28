import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  type GetCategoryResponse,
  GetCategoryResponseSchema,
} from '@goit-fullstack-final-project/schemas';

import { tryCatch } from '../../helpers/catchError';
import { get } from '../../helpers/http';

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
    const [error, categories] = await tryCatch(
      get<GetCategoryResponse | null>('/api/categories', {
        schema: GetCategoryResponseSchema,
      }),
    );

    if (error) {
      return thunkAPI.rejectWithValue(error.message);
    }

    return categories ?? [];
  },
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {},
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

export const categoriesReducer = categoriesSlice.reducer;
export type CategoriesState = ReturnType<typeof categoriesReducer>;
export type fetchCategoriesAction = ReturnType<typeof fetchCategories>;
