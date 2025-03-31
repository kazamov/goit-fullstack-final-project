import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type {
  CurrentUserDetails,
  GetCurrentUserResponse,
  OtherUserDetails,
  UserShortDetails,
} from '@goit-fullstack-final-project/schemas';
import { GetCurrentUserResponseSchema } from '@goit-fullstack-final-project/schemas';

import { tryCatch } from '../../helpers/catchError';
import { delay } from '../../helpers/delay';
import { get } from '../../helpers/http';

export interface UsersState {
  currentUser: UserShortDetails | null | undefined;
  profileDetails: CurrentUserDetails | OtherUserDetails | null;
  loading: boolean;
  error: string | null;
}

const initialState: UsersState = {
  currentUser: undefined,
  profileDetails: null,
  loading: false,
  error: null,
};

export const fetchCurrentUser = createAsyncThunk(
  'users/fetchCurrentUser',
  async () => {
    await delay(2000);
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

export const fetchProfileDetails = createAsyncThunk(
  'users/fetchProfileDetails',
  async (userId: string) => {
    const [error, profileDetails] = await tryCatch(
      get<OtherUserDetails | CurrentUserDetails>(
        `/api/users/${userId}/details`,
      ),
    );

    if (error) {
      return null;
    }

    return profileDetails;
  },
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setCurrentUser: (state, action: PayloadAction<UserShortDetails | null>) => {
      state.currentUser = action.payload;
    },
    updateAvatar: (state, action: PayloadAction<{ avatarUrl: string }>) => {
      if (state.currentUser) {
        state.currentUser = {
          ...state.currentUser,
          avatarUrl: action.payload.avatarUrl,
        };
      }
      if (state.profileDetails) {
        state.profileDetails = {
          ...state.profileDetails,
          avatarUrl: action.payload.avatarUrl,
        };
      }
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
      )
      .addCase(fetchProfileDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(
        fetchProfileDetails.fulfilled,
        (
          state,
          action: PayloadAction<OtherUserDetails | CurrentUserDetails | null>,
        ) => {
          state.loading = false;
          state.profileDetails = action.payload;
        },
      );
  },
});

export const usersReducer = usersSlice.reducer;
export const { setCurrentUser, updateAvatar } = usersSlice.actions;
