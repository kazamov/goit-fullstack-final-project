import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { testimonialsReducer } from './testimonials/slice';
import { usersReducer } from './users/slice';

const rootReducer = combineReducers({
  testimonials: testimonialsReducer,
  users: usersReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = typeof store.dispatch;
