import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';

import type { RootState } from '../store';

export type ModalType = 'login' | 'register' | 'logout' | 'mobileNavigation';

export interface UIState {
  modals: Record<ModalType, boolean>;
}

const initialState: UIState = {
  modals: {
    login: false,
    register: false,
    logout: false,
    mobileNavigation: false,
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
});

export const createModalStateSelector = (type: ModalType) =>
  createSelector(
    [(state: RootState) => state.ui.modals],
    (modals) => modals[type],
  );

export const uiReducer = uiSlice.reducer;
export const { setModalOpened } = uiSlice.actions;
