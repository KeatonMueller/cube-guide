import * as THREE from 'three';
import { create } from 'zustand';

export type Actions = {
    registerPlane: (key: string, plane: THREE.Object3D | null) => void;
};

export type PlanesState = {
    actions: Actions;
    planes: Record<string, THREE.Object3D>;
};

const initialState: Omit<PlanesState, 'actions'> = {
    planes: {},
};

const usePlanesStore = create<PlanesState>(set => ({
    ...initialState,
    actions: {
        registerPlane: (key: string, plane: THREE.Object3D | null) => {
            if (!plane) return;
            set(state => ({ planes: { ...state.planes, [key]: plane } }));
        },
    },
}));

export const usePlanesActions = () => usePlanesStore(state => state.actions);
export const usePlanes = () => usePlanesStore(state => state.planes);
