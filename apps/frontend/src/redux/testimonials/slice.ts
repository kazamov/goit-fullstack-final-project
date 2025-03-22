import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export interface Testimonials {
  items: string[];
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
    try {
      const response = await fetch('/api/testimonials');
      if (!response.ok) throw new Error('Failed to fetch testimonials');
      const data = await response.json();
      return data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.message);
    }
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
        (state, action: PayloadAction<string[]>) => {
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
