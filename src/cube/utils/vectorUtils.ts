import * as THREE from 'three';
import { AxisVector, type DirectedAxis } from '../constants';

/**
 * Apply the given Matrix3 to the given Vector3 and then round the
 * resulting values on the Vector3.
 */
export const applyMatrix3AndRound = (vector: THREE.Vector3, matrix: THREE.Matrix3): void => {
    vector.applyMatrix3(matrix);
    roundVector3(vector);
};

/**
 * Round the given Vector3's x, y, and z values.
 */
export const roundVector3 = (vector: THREE.Vector3): void => {
    // +0 avoids negative zero in the result
    vector.x = Math.round(vector.x) + 0;
    vector.y = Math.round(vector.y) + 0;
    vector.z = Math.round(vector.z) + 0;
};

/**
 * Return a Vector3 corresponding to the DirectedAxis.
 *
 * Make clones to not accidentally modify the AxisVector const.
 */
export const directedAxisToVector3 = (directedAxis: DirectedAxis): THREE.Vector3 => {
    return AxisVector[directedAxis.axisLabel].clone().multiplyScalar(directedAxis.direction);
};
