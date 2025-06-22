import * as THREE from 'three';
import type { StickerLocation } from '../constants';

export const getVector3String = (vector: THREE.Vector3): string => {
    if (!vector) return '';
    return `${vector.x}${vector.y}${vector.z}`;
};

export const getStickerLocationString = (location: StickerLocation): string => {
    if (!location) return '';
    // prettier-ignore
    return `${getVector3String(location.cubiePosition)}${getVector3String(location.facingVector)}`;
};
