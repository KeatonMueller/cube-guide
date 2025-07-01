import * as THREE from 'three';
import type { StickerLocation } from '../constants';

export type Vector3String = `${number},${number},${number}`;
export type StickerLocationString = `${Vector3String}|${Vector3String}`;

export const getVector3String = (vector: THREE.Vector3): Vector3String => {
    if (!vector) return '0,0,0';
    return `${vector.x},${vector.y},${vector.z}`;
};

export const getStickerLocationString = (location: StickerLocation): StickerLocationString => {
    if (!location) return '0,0,0|0,0,0';
    // prettier-ignore
    return `${getVector3String(location.cubiePosition)}|${getVector3String(location.facingVector)}`;
};

export const parseVector3String = (vector3String: Vector3String): THREE.Vector3 => {
    const [x, y, z] = vector3String.split(',');
    return new THREE.Vector3(parseFloat(x), parseFloat(y), parseFloat(z));
};

export const parseStickerLocationString = (stickerLocationString: StickerLocationString): StickerLocation => {
    const [cubiePositionString, facingVectorString] = stickerLocationString.split('|') as Vector3String[];
    return {
        cubiePosition: parseVector3String(cubiePositionString),
        facingVector: parseVector3String(facingVectorString),
    };
};
