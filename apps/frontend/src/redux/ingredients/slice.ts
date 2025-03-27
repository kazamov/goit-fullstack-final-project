import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { GetIngredientResponse } from '@goit-fullstack-final-project/schemas';

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
    try {
      const response = await fetch('/api/ingredients');
      if (!response.ok) throw new Error('Failed to fetch ingredients');
      const data = await response.json();
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
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
