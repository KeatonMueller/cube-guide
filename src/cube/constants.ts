import * as THREE from 'three';

/**
 * Axis vector enum
 */
export const AxisVector = {
    POSITIVE_X: new THREE.Vector3(1, 0, 0),
    POSITIVE_Y: new THREE.Vector3(0, 1, 0),
    POSITIVE_Z: new THREE.Vector3(0, 0, 1),
    NEGATIVE_X: new THREE.Vector3(-1, 0, 0),
    NEGATIVE_Y: new THREE.Vector3(0, -1, 0),
    NEGATIVE_Z: new THREE.Vector3(0, 0, -1),
};
