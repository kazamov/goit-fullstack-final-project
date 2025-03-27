import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { areasReducer } from './areas/slice';
import { categoriesReducer } from './categories/slice';
import { ingredientsReducer } from './ingredients/slice';
import { testimonialsReducer } from './testimonials/slice';
import { uiReducer } from './ui/slice';
import { usersReducer } from './users/slice';

const rootReducer = combineReducers({
  testimonials: testimonialsReducer,
  users: usersReducer,
  categories: categoriesReducer,
  ui: uiReducer,
  ingredients: ingredientsReducer,
  areas: areasReducer,
});

export const store = configureStore({
  reducer: rootReducer,
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = typeof store.dispatch;
