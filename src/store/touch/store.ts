import * as THREE from 'three';
import { create } from 'zustand';
import type { StickerLocation } from '../../cube/constants';

export type Actions = {
    setPointerLocation: (pointerLocation: THREE.Vector2 | null) => void;
    setPointerSelection: (pointerSelection: StickerLocation | null) => void;
};

export type TouchState = {
    actions: Actions;
    pointerLocation: THREE.Vector2 | null;
    pointerSelection: StickerLocation | null;
};

const initialState: Omit<TouchState, 'actions'> = {
    pointerLocation: null,
    pointerSelection: null,
};

const useTouchStore = create<TouchState>(set => ({
    ...initialState,
    actions: {
        setPointerLocation: (pointerLocation: THREE.Vector2 | null) => set(_ => ({ pointerLocation })),
        setPointerSelection: (pointerSelection: StickerLocation | null) => set(_ => ({ pointerSelection })),
    },
}));

export const useTouchActions = () => useTouchStore(state => state.actions);
export const usePointerLocation = () => useTouchStore(state => state.pointerLocation);
export const usePointerSelection = () => useTouchStore(state => state.pointerSelection);
