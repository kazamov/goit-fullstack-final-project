import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import {
  type GetCurrentUserResponse,
  GetCurrentUserResponseSchema,
  type UserShortDetails,
} from '@goit-fullstack-final-project/schemas';

import { tryCatch } from '../../helpers/catchError';
import { get } from '../../helpers/http';

export interface UsersState {
  currentUser: UserShortDetails | null;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  currentUser: null,
  loading: false,
  error: null,
};

export const fetchCurrentUser = createAsyncThunk(
  'users/fetchCurrentUser',
  async () => {
    const [error, currentUser] = await tryCatch(
      get<GetCurrentUserResponse | null>('/api/users/current', {
        schema: GetCurrentUserResponseSchema,
      }),
    );

    if (error) {
      return null;
    }

    return currentUser;
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<UserShortDetails | null>) => {
      state.currentUser = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchCurrentUser.fulfilled,
        (state, action: PayloadAction<UserShortDetails | null>) => {
          state.loading = false;
          state.currentUser = action.payload;
        },
      );
  },
});

export const usersReducer = usersSlice.reducer;
export const { setCurrentUser } = usersSlice.actions;
