import * as THREE from 'three';
import { type Move, type AxisValue, type Direction, type Sign, type DirectedAxis, HALF_PI } from '../constants';
import { findCameraAxes } from './facingUtils';

/**
 * Check if the given move targets the given position.
 */
export const doesMoveTargetPosition = (move: Move, position: THREE.Vector3): boolean => {
    return move.axisValues.includes(position[move.axisLabel] as AxisValue);
};

const directedAxisAndDirectionToSign = (directedAxis: DirectedAxis, direction: Direction): Sign => {
    // to start with, all rotation directions are opposite the clockwise/counterclockwise direction
    const sign = direction === 'clockwise' ? -1 : 1;
    // but if the axis is facing the other way, swap it
    return (sign * directedAxis.direction) as Sign;
};

const OUTER_LAYER_MOVES = ['u', 'd', 'f', 'b', 'r', 'l'];
const SLICE_MOVES = ['m', 'e', 's'];
const ROTATION_MOVES = ['x', 'y', 'z'];
/**
 * Based on the given keypress and camera object, return the move (if any) that
 * the key corresponds to.
 */
export const keyToMove = (key: string, camera: THREE.Object3D): Move | null => {
    const cameraAxes = findCameraAxes(camera);
    let directedAxis: DirectedAxis;

    switch (key) {
        case 'u':
        case 'U':
        case 'y':
        case 'Y':
            directedAxis = cameraAxes.up;
            break;
        case 'd':
        case 'D':
        case 'e':
        case 'E':
            directedAxis = cameraAxes.down;
            break;
        case 'f':
        case 'F':
        case 's':
        case 'S':
        case 'z':
        case 'Z':
            directedAxis = cameraAxes.front;
            break;
        case 'b':
        case 'B':
            directedAxis = cameraAxes.back;
            break;
        case 'r':
        case 'R':
        case 'x':
        case 'X':
            directedAxis = cameraAxes.right;
            break;
        case 'l':
        case 'L':
        case 'm':
        case 'M':
            directedAxis = cameraAxes.left;
            break;
        default:
            return null;
    }

    const direction: Direction = key === key.toUpperCase() ? 'counterclockwise' : 'clockwise';
    const sign = directedAxisAndDirectionToSign(directedAxis, direction);

    const axisValues: AxisValue[] = [];
    if (OUTER_LAYER_MOVES.includes(key.toLowerCase())) {
        axisValues.push(directedAxis.direction);
    } else if (SLICE_MOVES.includes(key.toLowerCase())) {
        axisValues.push(0);
    } else if (ROTATION_MOVES.includes(key.toLowerCase())) {
        axisValues.push(-1, 0, 1);
    }

    return {
        axisLabel: directedAxis.axisLabel,
        axisValues,
        targetTheta: HALF_PI * sign,
    };
};
