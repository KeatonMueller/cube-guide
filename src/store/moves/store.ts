import { create } from 'zustand';
import {
    CUBIE_POSITION_STRINGS,
    CUBIE_POSITIONS,
    STICKER_LOCATION_STRINGS,
    STICKER_LOCATIONS,
    type Move,
} from '../../cube/constants';
import { doesMoveTargetPosition } from '../../cube/utils/moveUtils';
import { getStickerLocationString, getVector3String } from '../../cube/utils/stringUtils';

export type Actions = {
    queueMove: (move: Move) => void;
    dequeueMove: () => void;
    clearMoves: () => void;
    executeMove: (move: Move) => void;
    clearCubieMove: (posString: string) => void;
    clearStickerMove: (locationString: string) => void;
};

export type MoveMap = Record<string, Move | null>;

export type MovesState = {
    actions: Actions;
    moveBuffer: Move[];
    strBuffer: Move[];
    cubieMoves: MoveMap;
    stickerMoves: MoveMap;
};

const initialState: Omit<MovesState, 'actions'> = {
    moveBuffer: [],
    strBuffer: [],
    cubieMoves: {},
    stickerMoves: {},
};

CUBIE_POSITION_STRINGS.forEach(positionString => {
    initialState.cubieMoves[positionString] = null;
});

STICKER_LOCATION_STRINGS.forEach(locationString => {
    initialState.stickerMoves[locationString] = null;
});

export const useMovesStore = create<MovesState>(set => ({
    ...initialState,
    actions: {
        queueMove: (move: Move) => set(state => ({ moveBuffer: [...state.moveBuffer, move] })),
        dequeueMove: () => set(state => ({ moveBuffer: state.moveBuffer.slice(1) })),
        clearMoves: () => set(() => ({ moveBuffer: [] })),
        executeMove: (move: Move) =>
            set(state => {
                const cubieMoves: MoveMap = {};
                CUBIE_POSITIONS.forEach(position => {
                    if (doesMoveTargetPosition(move, position)) {
                        cubieMoves[getVector3String(position)] = move;
                    }
                });

                const stickerMoves: MoveMap = {};
                STICKER_LOCATIONS.forEach(stickerLocation => {
                    if (doesMoveTargetPosition(move, stickerLocation.cubiePosition)) {
                        stickerMoves[getStickerLocationString(stickerLocation)] = move;
                    }
                });

                return {
                    ...state,
                    cubieMoves: {
                        ...state.cubieMoves,
                        ...cubieMoves,
                    },
                    stickerMoves: {
                        ...state.stickerMoves,
                        ...stickerMoves,
                    },
                };
            }),
        clearCubieMove: (posString: string) =>
            set(state => ({
                ...state,
                cubieMoves: {
                    ...state.cubieMoves,
                    [posString]: null,
                },
            })),
        clearStickerMove: (locationString: string) =>
            set(state => ({
                ...state,
                stickerMoves: {
                    ...state.stickerMoves,
                    [locationString]: null,
                },
            })),
    },
}));
