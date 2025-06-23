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
    roundVector3(vector);
};

/**
 * Round the given Vector3's x, y, and z values.
 */
export const roundVector3 = (vector: THREE.Vector3): void => {
    vector.x = Math.round(vector.x);
    vector.y = Math.round(vector.y);
    vector.z = Math.round(vector.z);
};
