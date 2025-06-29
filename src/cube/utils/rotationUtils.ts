import * as THREE from 'three';
import { AxisLabel, type TAxisLabel } from '../constants';

/**
 * Rotation matrices to rotate the THREE.Vector3 about an axis by
 * a given angle.
 *
 * See: https://en.wikipedia.org/wiki/Rotation_matrix#In_three_dimensions
 * for more info on rotation matrices.
 */

/**
 * Get a rotation matrix to rotate on the X-axis
 * by theta radians.
 */
const getXRotationMatrix = (theta: number): THREE.Matrix3 => {
    // prettier-ignore
    return new THREE.Matrix3(
        1, 0, 0,
        0, Math.cos(theta), -Math.sin(theta),
        0, Math.sin(theta), Math.cos(theta)
    );
};

/**
 * Get a rotation matrix to rotate on the Y-axis
 * by theta radians.
 */
const getYRotationMatrix = (theta: number): THREE.Matrix3 => {
    // prettier-ignore
    return new THREE.Matrix3(
        Math.cos(theta), 0, Math.sin(theta),
        0, 1, 0,
        -Math.sin(theta), 0, Math.cos(theta)
    );
};

/**
 * Get a rotation matrix to rotate on the Z-axis
 * by theta radians.
 */
const getZRotationMatrix = (theta: number): THREE.Matrix3 => {
    // prettier-ignore
    return new THREE.Matrix3(
        Math.cos(theta), -Math.sin(theta), 0,
        Math.sin(theta), Math.cos(theta), 0,
        0, 0, 1
    );
};

/**
 * Map the axis to the function for getting its rotation matrix.
 * Key of the map cannot be a THREE.Vector3 so calling toString().
 */
const AxisToRotationMatrix: Record<TAxisLabel, Function> = {
    [AxisLabel.X]: getXRotationMatrix,
    [AxisLabel.Y]: getYRotationMatrix,
    [AxisLabel.Z]: getZRotationMatrix,
} as const;

/**
 * Get a rotation matrix for the given axis vector
 * for the given number of radians.
 */
export const getRotationMatrix = (axisLabel: TAxisLabel, theta: number): THREE.Matrix3 => {
    return AxisToRotationMatrix[axisLabel](theta);
};
