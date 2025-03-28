import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { GetTestimonialResponse } from '@goit-fullstack-final-project/schemas';

import { tryCatch } from '../../helpers/catchError';
import { get } from '../../helpers/http';

export interface Testimonials {
  items: GetTestimonialResponse;
  loading: boolean;
  error: string | null;
}

const initialState: Testimonials = {
  items: [],
  loading: false,
  error: null,
};

export const fetchTestimonials = createAsyncThunk(
  'testimonials/fetchTestimonials',
  async (_, thunkAPI) => {
    const [error, data] = await tryCatch(
      get<GetTestimonialResponse | null>('/api/testimonials'),
    );

    if (error) {
      return thunkAPI.rejectWithValue(error.message);
    }

    return data ?? [];
  },
);

const testimonialsSlice = createSlice({
  name: 'testimonials',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestimonials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchTestimonials.fulfilled,
        (state, action: PayloadAction<GetTestimonialResponse>) => {
          state.loading = false;
          state.items = action.payload;
        },
      )
      .addCase(fetchTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const testimonialsReducer = testimonialsSlice.reducer;
export type TestimonialsState = ReturnType<typeof testimonialsReducer>;
export type fetchTestimonialsAction = ReturnType<typeof fetchTestimonials>;
