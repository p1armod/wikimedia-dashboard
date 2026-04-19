import { configureStore } from '@reduxjs/toolkit';
import analyticsReducer from './analyticsSlice';
import themeReducer from './themeSlice';


export const store = configureStore({
  reducer: {
    analytics: analyticsReducer,
    theme: themeReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
