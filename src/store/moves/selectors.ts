import type { MovesState } from './store';
import { CUBIE_POSITION_STRINGS, STICKER_LOCATION_STRINGS, type Move } from '../../cube/constants';
import { createSelector } from 'reselect';

export const selectMovesActions = (state: MovesState) => state.actions;
export const selectMoveBuffer = (state: MovesState) => state.moveBuffer;
export const selectCubieMoves = (state: MovesState) => state.cubieMoves;
export const selectStickerMoves = (state: MovesState) => state.stickerMoves;

export const selectNextMove = createSelector([selectMoveBuffer], (moveBuffer): Move | null => {
    return moveBuffer?.length ? moveBuffer[0] : null;
});

export const selectAreCubieMovesActive = createSelector([selectCubieMoves], (cubieMoves): boolean => {
    for (const positionString of CUBIE_POSITION_STRINGS) {
        if (cubieMoves[positionString] !== null) return true;
    }
    return false;
});

export const selectAreStickerMovesActive = createSelector([selectStickerMoves], (stickerMoves): boolean => {
    for (const locationString of STICKER_LOCATION_STRINGS) {
        if (stickerMoves[locationString] !== null) return true;
    }
    return false;
});

export const selectIsActiveMove = createSelector(
    [selectAreCubieMovesActive, selectAreStickerMovesActive],
    (cubieMovesActive, stickerMovesActive): boolean => {
        return cubieMovesActive || stickerMovesActive;
    }
);
