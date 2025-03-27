import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  type GetAreaResponse,
  GetAreaResponseSchema,
} from '@goit-fullstack-final-project/schemas';

import { tryCatch } from '../../helpers/catchError';
import { get } from '../../helpers/http';

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
    const [error, areas] = await tryCatch(
      get<GetAreaResponse | null>('/api/areas', {
        schema: GetAreaResponseSchema,
      }),
    );

    if (error) {
      return thunkAPI.rejectWithValue(error.message);
    }

    return areas ?? [];
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
