import type { RootState } from '../store';

export const selectTestimonials = (state: RootState) =>
  state.testimonials.items;
export const selectTestimonialsLoading = (state: RootState) =>
  state.testimonials.loading;
export const selectTestimonialsError = (state: RootState) =>
  state.testimonials.error;
