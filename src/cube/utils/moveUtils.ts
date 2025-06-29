import * as THREE from 'three';
import { type Move, type AxisValue } from '../constants';

/**
 * Check if the given move targets the given position.
 */
export const doesMoveTargetPosition = (move: Move, position: THREE.Vector3): boolean => {
    return move.axisValues.includes(position[move.axisLabel] as AxisValue);
};
