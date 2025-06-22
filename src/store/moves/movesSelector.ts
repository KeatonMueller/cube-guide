import { createSelector } from '@reduxjs/toolkit';
import type { AppState } from '../store';
import { CUBIE_POSITION_STRINGS, type Move } from '../../cube/constants';

export const selectMoveBuffer = (appState: AppState) =>
    appState.moves.moveBuffer;

export const selectCubieMoves = (appState: AppState) =>
    appState.moves.cubieMoves;

export const selectNextMove = createSelector(
    [selectMoveBuffer],
    (moveBuffer): Move | null => {
        return moveBuffer?.length ? moveBuffer[0] : null;
    }
);

export const selectCubieMovesEmpty = createSelector(
    [selectCubieMoves],
    (cubieMoves): boolean => {
        for (const positionString of CUBIE_POSITION_STRINGS) {
            if (cubieMoves[positionString] !== null) return false;
        }
        return true;
    }
);
