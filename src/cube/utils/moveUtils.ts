import * as THREE from 'three';
import { AXIS_LABEL_TO_VECTOR, type Move, type TAxisValue } from '../constants';
import { getRotationMatrix } from './rotationUtils';

/**
 * For the given move and angle theta, return the corresponding rotation matrix
 * needed to apply to a Vector3 position to execute the move.
 */
export const moveToRotationMatrix = (
    move: Move,
    theta: number
): THREE.Matrix3 => {
    const rotationAxis = AXIS_LABEL_TO_VECTOR[move.axisLabel];

    return getRotationMatrix(rotationAxis, theta);
};

/**
 * Check if the given move targets the given position.
 */
export const doesMoveTargetPosition = (
    move: Move,
    position: THREE.Vector3
): boolean => {
    return move.axisValues.includes(position[move.axisLabel] as TAxisValue);
};
