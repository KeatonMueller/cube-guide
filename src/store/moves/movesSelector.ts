import { createSelector } from '@reduxjs/toolkit';
import type { AppState } from '../store';
import {
    CUBIE_POSITION_STRINGS,
    STICKER_LOCATION_STRINGS,
    type Move,
} from '../../cube/constants';

export const selectMoveBuffer = (appState: AppState) =>
    appState.moves.moveBuffer;

export const selectCubieMoves = (appState: AppState) =>
    appState.moves.cubieMoves;

export const selectStickerMoves = (appState: AppState) =>
    appState.moves.stickerMoves;

export const selectNextMove = createSelector(
    [selectMoveBuffer],
    (moveBuffer): Move | null => {
        return moveBuffer?.length ? moveBuffer[0] : null;
    }
);

export const selectAreCubieMovesActive = createSelector(
    [selectCubieMoves],
    (cubieMoves): boolean => {
        for (const positionString of CUBIE_POSITION_STRINGS) {
            if (cubieMoves[positionString] !== null) return true;
        }
        return false;
    }
);

export const selectAreStickerMovesActive = createSelector(
    [selectStickerMoves],
    (stickerMoves): boolean => {
        for (const locationString of STICKER_LOCATION_STRINGS) {
            if (stickerMoves[locationString] !== null) return true;
        }
        return false;
    }
);

export const selectIsActiveMove = createSelector(
    [selectAreCubieMovesActive, selectAreStickerMovesActive],
    (cubieMovesActive, stickerMovesActive): boolean => {
        return cubieMovesActive || stickerMovesActive;
    }
);
