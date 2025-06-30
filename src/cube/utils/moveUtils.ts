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
            directedAxis = cameraAxes.up;
            break;
        case 'd':
        case 'D':
            directedAxis = cameraAxes.down;
            break;
        case 'f':
        case 'F':
            directedAxis = cameraAxes.front;
            break;
        case 'b':
        case 'B':
            directedAxis = cameraAxes.back;
            break;
        case 'r':
        case 'R':
            directedAxis = cameraAxes.right;
            break;
        case 'l':
        case 'L':
            directedAxis = cameraAxes.left;
            break;
        default:
            return null;
    }

    const direction: Direction = key === key.toUpperCase() ? 'counterclockwise' : 'clockwise';
    const sign = directedAxisAndDirectionToSign(directedAxis, direction);

    return {
        axisLabel: directedAxis.axisLabel,
        axisValues: [directedAxis.direction],
        targetTheta: HALF_PI * sign,
    };
};
