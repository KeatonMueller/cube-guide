import * as THREE from 'three';

/**
 * Apply the given Matrix3 to the given Vector3 and then round the
 * resulting values on the Vector3.
 */
export const applyMatrix3AndRound = (
    vector: THREE.Vector3,
    matrix: THREE.Matrix3
): void => {
    vector.applyMatrix3(matrix);
    vector.x = Math.round(vector.x);
    vector.y = Math.round(vector.y);
    vector.z = Math.round(vector.z);
};
