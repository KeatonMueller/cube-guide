import * as THREE from 'three';
import { create } from 'zustand';
import { AxisVector, type ColorLabel, type StickerLocation } from '../../cube/constants';
import { getVector3String } from '../../cube/utils/stringUtils';

/**
 * The cube repr contains the stickers of each face in this order:
 * up, down, front, back, right, left
 *
 * Stickers on each face are read left to right, top to bottom.
 *
 * Since there are 6 faces with 9 stickers each, the cube repr
 * is a string of length 54.
 */
const REPR_FACE_ORDER = [
    getVector3String(AxisVector.y.clone()),
    getVector3String(AxisVector.y.clone().multiplyScalar(-1)),
    getVector3String(AxisVector.z.clone()),
    getVector3String(AxisVector.z.clone().multiplyScalar(-1)),
    getVector3String(AxisVector.x.clone()),
    getVector3String(AxisVector.x.clone().multiplyScalar(-1)),
];

/**
 * Given a sticker's location in 3D space, find the corresponding x,y
 * coordinates if we were looking head on at the face the sticker is on
 * in a 2D world where (0,0) is the center piece.
 */
const getPos2d = (stickerLocation: StickerLocation): THREE.Vector2Like => {
    const { cubiePosition, facingVector } = stickerLocation;
    if (facingVector.y === 1) {
        return { x: cubiePosition.x, y: cubiePosition.z };
    } else if (facingVector.y === -1) {
        return { x: cubiePosition.x, y: -cubiePosition.z };
    } else if (facingVector.z === 1) {
        return { x: cubiePosition.x, y: -cubiePosition.y };
    } else if (facingVector.z === -1) {
        return { x: -cubiePosition.x, y: -cubiePosition.y };
    } else if (facingVector.x === 1) {
        return { x: -cubiePosition.z, y: -cubiePosition.y };
    } else if (facingVector.x === -1) {
        return { x: cubiePosition.z, y: -cubiePosition.y };
    }

    return { x: 0, y: 0 };
};

/**
 * Find the index in the length-54 repr string that stores the given sticker location.
 */
const getReprIdx = (stickerLocation: StickerLocation): number => {
    const { facingVector } = stickerLocation;

    const faceIdx = REPR_FACE_ORDER.indexOf(getVector3String(facingVector));
    const pos2d = getPos2d(stickerLocation);
    const row = pos2d.y + 1;
    const col = pos2d.x + 1;

    return faceIdx * 9 + row * 3 + col;
};

export type Actions = {
    updateRepr: (stickerLocation: StickerLocation, colorLabel: ColorLabel) => void;
};

export type ReprState = {
    actions: Actions;
    repr: string;
};

const initialState: Omit<ReprState, 'actions'> = {
    repr: 'X'.repeat(54),
};

const useReprStore = create<ReprState>(set => ({
    ...initialState,
    actions: {
        updateRepr: (stickerLocation: StickerLocation, colorLabel: ColorLabel) =>
            set(state => {
                const idx = getReprIdx(stickerLocation);
                const newRepr = state.repr.substring(0, idx) + colorLabel + state.repr.substring(idx + 1);
                return { repr: newRepr };
            }),
    },
}));

export const useReprActions = () => useReprStore(state => state.actions);
export const useRepr = () => useReprStore(state => state.repr);
