import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

type ModalType = 'login' | 'register' | 'logout';

export interface UIState {
  modals: Record<ModalType, boolean>;
}

const initialState: UIState = {
  modals: {
    login: false,
    register: false,
    logout: false,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setModalOpened: (
      state,
      action: PayloadAction<{ modal: ModalType; opened: boolean }>,
    ) => {
      if (action.payload.opened) {
        Object.keys(state.modals).forEach((key) => {
          if (key !== action.payload.modal) {
            state.modals[key as ModalType] = false;
          }
        });
      }

      state.modals[action.payload.modal] = action.payload.opened;
    },
  },
  selectors: {
    selectIsLoginModalOpened: (state: UIState) => state.modals.login,
    selectIsRegisterModalOpened: (state: UIState) => state.modals.register,
    selectIsLogoutModalOpened: (state: UIState) => state.modals.logout,
  },
});

export const uiReducer = uiSlice.reducer;
export const { setModalOpened } = uiSlice.actions;
export const {
  selectIsLoginModalOpened,
  selectIsRegisterModalOpened,
  selectIsLogoutModalOpened,
} = uiSlice.selectors;
