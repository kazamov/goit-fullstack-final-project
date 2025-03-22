import { combineReducers, configureStore } from '@reduxjs/toolkit';
import persistReducer from 'redux-persist/es/persistReducer';
import persistStore from 'redux-persist/es/persistStore';
import storage from 'redux-persist/lib/storage';

import { testimonialsReducer } from './testimonials/slice';

const persistConfig = {
  key: 'foodies',
  storage,
};

const persistedReducer = persistReducer(
  persistConfig,
  combineReducers({
    testimonials: testimonialsReducer,
    // additional reducers can be added here
  }),
);

const rootReducer = combineReducers({
  persisted: persistedReducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export const persistor = persistStore(store);

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = typeof store.dispatch;
