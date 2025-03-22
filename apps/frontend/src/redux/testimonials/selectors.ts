import type { RootState } from '../store';

export const selectTestimonials = (state: RootState) =>
  state.persisted.testimonials.items;
export const selectTestimonialsLoading = (state: RootState) =>
  state.persisted.testimonials.loading;
export const selectTestimonialsError = (state: RootState) =>
  state.persisted.testimonials.error;
