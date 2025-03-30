import type { RootState } from '../store';

export const selectCurrentUser = (state: RootState) => state.users.currentUser;

export const selectCurrentUserId = (state: RootState) =>
  state.users.currentUser?.id;

export const selectProfileDetails = (state: RootState) =>
  state.users.profileDetails;
