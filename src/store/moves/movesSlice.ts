import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
    CUBIE_POSITION_STRINGS,
    CUBIE_POSITIONS,
    type Move,
} from '../../cube/constants';
import { doesMoveApplyToPosition } from '../../cube/utils/moveUtils';
import { getVector3String } from '../../cube/utils/stringUtils';

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
        // clear the move buffer
        clearMoves: state => {
            state.moveBuffer = [];
        },
        // execute the given move by assigning it to the relevant cubies
        executeMove: (state, action: PayloadAction<Move>) => {
            const move = action.payload;
            CUBIE_POSITIONS.forEach(position => {
                if (doesMoveApplyToPosition(move, position)) {
                    state.cubieMoves[getVector3String(position)] = move;
                }
            });
        },
        // clear out the move for an individual cubie
        clearCubieMove: (state, action: PayloadAction<string>) => {
            state.cubieMoves[action.payload] = null;
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
