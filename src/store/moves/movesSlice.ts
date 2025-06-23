import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import {
    CUBIE_POSITION_STRINGS,
    CUBIE_POSITIONS,
    STICKER_LOCATION_STRINGS,
    STICKER_LOCATIONS,
    type Move,
} from '../../cube/constants';
import { doesMoveTargetPosition } from '../../cube/utils/moveUtils';
import {
    getStickerLocationString,
    getVector3String,
} from '../../cube/utils/stringUtils';

export type MoveMap = Record<string, Move | null>;

export type MovesState = {
    moveBuffer: Move[];
    cubieMoves: MoveMap;
    stickerMoves: MoveMap;
};

const initialState: MovesState = {
    moveBuffer: [],
    cubieMoves: {},
    stickerMoves: {},
};

CUBIE_POSITION_STRINGS.forEach(positionString => {
    initialState.cubieMoves[positionString] = null;
});

STICKER_LOCATION_STRINGS.forEach(locationString => {
    initialState.stickerMoves[locationString] = null;
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
                if (doesMoveTargetPosition(move, position)) {
                    state.cubieMoves[getVector3String(position)] = move;
                }
            });
            STICKER_LOCATIONS.forEach(location => {
                if (doesMoveTargetPosition(move, location.cubiePosition)) {
                    state.stickerMoves[getStickerLocationString(location)] =
                        move;
                }
            });
        },
        // clear out the move for an individual cubie
        clearCubieMove: (state, action: PayloadAction<string>) => {
            state.cubieMoves[action.payload] = null;
        },
        // clear out the move for an individual sticker
        clearStickerMove: (state, action: PayloadAction<string>) => {
            state.stickerMoves[action.payload] = null;
        },
    },
});

export const {
    queueMove,
    dequeueMove,
    clearMoves,
    executeMove,
    clearCubieMove,
    clearStickerMove,
} = movesSlice.actions;

export const movesReducer = movesSlice.reducer;
