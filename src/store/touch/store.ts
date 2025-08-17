import * as THREE from 'three';
import { create } from 'zustand';
import type { StickerLocation } from '../../cube/constants';

export type Actions = {
    setPointerSelection: (pointerSelection: StickerLocation | null) => void;
    setPointerPosition: (pointerPosition: THREE.Vector3 | null) => void;
};

export type TouchState = {
    actions: Actions;
    pointerSelection: StickerLocation | null;
    pointerPosition: THREE.Vector3 | null;
};

const initialState: Omit<TouchState, 'actions'> = {
    pointerSelection: null,
    pointerPosition: null,
};

const useTouchStore = create<TouchState>(set => ({
    ...initialState,
    actions: {
        setPointerSelection: (pointerSelection: StickerLocation | null) => set(_ => ({ pointerSelection })),
        setPointerPosition: (pointerPosition: THREE.Vector3 | null) => set(_ => ({ pointerPosition })),
    },
}));

export const useTouchActions = () => useTouchStore(state => state.actions);
export const usePointerSelection = () => useTouchStore(state => state.pointerSelection);
export const usePointerPosition = () => useTouchStore(state => state.pointerPosition);
