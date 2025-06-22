import * as THREE from 'three';

export const getVector3String = (vector: THREE.Vector3): string => {
    if (!vector) return '';
    return `${vector.x}${vector.y}${vector.z}`;
};
