import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { CUBIE_POSITION_STRINGS, type Move } from '../../cube/constants';

export type CubieMoves = Record<string, Move | null>;

export type MovesState = {
    moveBuffer: Move[];
    cubieMoves: CubieMoves;
};

const initialState: MovesState = {
    moveBuffer: [],
    cubieMoves: {},
};

CUBIE_POSITION_STRINGS.forEach(positionString => {
    initialState.cubieMoves[positionString] = null;
});

export const movesSlice = createSlice({
    name: 'moves',
    initialState,
    reducers: {
        // add move to the move buffer; does not immediately execute it
        queueMove: (state, action: PayloadAction<Move>) => {
            state.moveBuffer.push(action.payload);
        },
        // remove first move from buffer
        dequeueMove: state => {
            state.moveBuffer.shift();
        },
        // execute the given move
        executeMove: (state, action: PayloadAction<Move>) => {
            // TODO: only set moves for the necessary positions
            CUBIE_POSITION_STRINGS.forEach(positionString => {
                state.cubieMoves[positionString] = action.payload;
            });
        },
        // clear out move for an individual cubie
        clearCubieMove: (state, action: PayloadAction<string>) => {
            state.cubieMoves[action.payload] = null;
        },
        // clear the move buffer
        clearMoves: state => {
            state.moveBuffer = [];
        },
    },
});

export const {
    queueMove,
    dequeueMove,
    executeMove,
    clearCubieMove,
    clearMoves,
} = movesSlice.actions;

export const movesReducer = movesSlice.reducer;
