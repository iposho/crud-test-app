import { configureStore } from '@reduxjs/toolkit';
import { serverApi } from './api/server.api.ts';

export const store = configureStore({
  reducer: {
    [serverApi.reducerPath]: serverApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(serverApi.middleware),
})