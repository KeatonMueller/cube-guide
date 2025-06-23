import * as THREE from 'three';
import {
    AxisVector,
    Direction,
    Layer,
    POSITIVE,
    type Move,
} from '../constants';
import { getRotationMatrix } from './rotationUtils';

/**
 * For the given move and angle theta, return the corresponding rotation matrix
 * needed to apply to a Vector3 position to execute the move.
 */
export const moveToRotationMatrix = (
    move: Move,
    theta: number
): THREE.Matrix3 => {
    let rotationAxis;
    switch (move.layer) {
        case Layer.F:
        case Layer.B:
        case Layer.S:
            rotationAxis = AxisVector[POSITIVE].Z;
            break;
        case Layer.U:
        case Layer.D:
        case Layer.E:
            rotationAxis = AxisVector[POSITIVE].Y;
            break;
        case Layer.R:
        case Layer.L:
        case Layer.M:
            rotationAxis = AxisVector[POSITIVE].X;
            break;
        default:
            rotationAxis = new THREE.Vector3(0, 0, 0);
    }

    let rotationDirection;
    switch (move.layer) {
        case Layer.F:
        case Layer.U:
        case Layer.R:
        case Layer.S:
            rotationDirection = move.direction === Direction.NORMAL ? -1 : 1;
            break;
        case Layer.B:
        case Layer.D:
        case Layer.L:
        case Layer.M:
        case Layer.E:
        default:
            rotationDirection = move.direction === Direction.NORMAL ? 1 : -1;
            break;
    }

    return getRotationMatrix(rotationAxis, rotationDirection * theta);
};

/**
 * Check if the given move would impact the cubie at the given position.
 */
export const doesMoveApplyToPosition = (
    move: Move,
    position: THREE.Vector3
): boolean => {
    switch (move.layer) {
        case Layer.F:
            return position.z === 1;
        case Layer.B:
            return position.z === -1;
        case Layer.U:
            return position.y === 1;
        case Layer.D:
            return position.y === -1;
        case Layer.R:
            return position.x === 1;
        case Layer.L:
            return position.x === -1;
        case Layer.M:
            return position.x === 0;
        case Layer.E:
            return position.y === 0;
        case Layer.S:
            return position.z === 0;
        default:
            return false;
    }
};
