import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { GetAreaResponse } from '@goit-fullstack-final-project/schemas';

export interface Areas {
  items: GetAreaResponse;
  loading: boolean;
  error: string | null;
}

const initialState: Areas = {
  items: [],
  loading: false,
  error: null,
};

export const fetchAreas = createAsyncThunk(
  'areas/fetchAreas',
  async (_, thunkAPI) => {
    try {
      const response = await fetch('/api/areas');
      if (!response.ok) throw new Error('Failed to fetch areas');
      const data = await response.json();
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
  },
);

const areasSlice = createSlice({
  name: 'areas',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAreas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAreas.fulfilled,
        (state, action: PayloadAction<GetAreaResponse>) => {
          state.loading = false;
          state.items = action.payload;
        },
      )
      .addCase(fetchAreas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const areasReducer = areasSlice.reducer;
export type AreasState = ReturnType<typeof fetchAreas>;
export type fetchIngredientsAction = ReturnType<typeof fetchAreas>;
