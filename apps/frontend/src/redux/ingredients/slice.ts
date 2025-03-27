import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  type GetIngredientResponse,
  GetIngredientResponseSchema,
} from '@goit-fullstack-final-project/schemas';

import { tryCatch } from '../../helpers/catchError';
import { get } from '../../helpers/http';

export interface Ingredients {
  items: GetIngredientResponse;
  loading: boolean;
  error: string | null;
}

const initialState: Ingredients = {
  items: [],
  loading: false,
  error: null,
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchIngredients',
  async (_, thunkAPI) => {
    const [error, ingredients] = await tryCatch(
      get<GetIngredientResponse | null>('/api/ingredients', {
        schema: GetIngredientResponseSchema,
      }),
    );

    if (error) {
      return thunkAPI.rejectWithValue(error.message);
    }

    return ingredients ?? [];
  },
);

const categoriesSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchIngredients.fulfilled,
        (state, action: PayloadAction<GetIngredientResponse>) => {
          state.loading = false;
          state.items = action.payload;
        },
      )
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const ingredientsReducer = categoriesSlice.reducer;
export type IngredientsState = ReturnType<typeof fetchIngredients>;
export type fetchIngredientsAction = ReturnType<typeof fetchIngredients>;
