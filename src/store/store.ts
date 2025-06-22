import { configureStore } from '@reduxjs/toolkit';
import { movesReducer } from './moves/movesSlice';

export const store = configureStore({
    reducer: {
        moves: movesReducer,
    },
});

export type AppState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
