import * as THREE from 'three';
import {
    type Move,
    type AxisValue,
    type Direction,
    type Sign,
    type DirectedAxis,
    HALF_PI,
    type StickerLocation,
    FACE,
    type Face,
    type AxisLabel,
    AXIS_LABEL,
} from '../constants';
import { findCameraAxes } from './facingUtils';
import { getVector3String } from './stringUtils';
import { directedAxisToVector3 } from './vectorUtils';
import type { Camera } from '@react-three/fiber';
import { getDragVector } from './touchUtils';

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

/**
 * Based on the clicked sticker, the start and end locations, and the camera position,
 * find the corresponding move.
 */
export const getPointerMove = (
    pointerSelection: StickerLocation,
    initPointerLocation: THREE.Vector2,
    currPointerLocation: THREE.Vector2,
    camera: Camera,
    canvas: HTMLCanvasElement
): Move | null => {
    const moveMagnitude = HALF_PI; // radianDistance;
    const { cubiePosition, facingVector } = pointerSelection;
    const cameraAxes = findCameraAxes(camera);

    const clickedFace: Face = Object.values(FACE).find(face =>
        directedAxisToVector3(cameraAxes[face]).equals(facingVector)
    )!;

    const clickedAxis: AxisLabel = Object.values(AXIS_LABEL).find(
        axisLabel => directedAxisToVector3(cameraAxes[clickedFace])[axisLabel] !== 0
    )!;
    const clickedDirectedAxis: DirectedAxis = {
        axisLabel: clickedAxis,
        direction: facingVector[clickedAxis] as Sign,
    };

    const dragVector = getDragVector(
        initPointerLocation,
        currPointerLocation,
        clickedDirectedAxis,
        cameraAxes,
        camera,
        canvas
    );

    const info: any = `
        clickedFace: ${clickedFace},
        clickedDirectedAxis: ${JSON.stringify(clickedDirectedAxis)},
        cubiePosition: ${getVector3String(cubiePosition)}
        facingVector: ${getVector3String(facingVector)}
        dragVector: ${dragVector.x},${dragVector.y}
        cameraAxes: {
          up: ${JSON.stringify(cameraAxes.up)}
          down: ${JSON.stringify(cameraAxes.down)}
          front: ${JSON.stringify(cameraAxes.front)}
          back: ${JSON.stringify(cameraAxes.back)}
          right: ${JSON.stringify(cameraAxes.right)}
          left: ${JSON.stringify(cameraAxes.left)}
        },
    `;
    console.log(info, camera);

    // because we're using OrbitControls, moves can generally be categorized as
    // "interacting with top/bottom" and "not interacting with top/bottom"
    if (clickedAxis !== 'y') {
        const moveAxis =
            dragVector.x !== 0
                ? 'y'
                : Object.values(AXIS_LABEL).filter(axis => axis !== 'y' && axis !== clickedAxis)[0];
        // one of these is zero so simply add to find the non-zero one
        const dragSign = dragVector.x + dragVector.y;

        let moveSign = 1;
        if (moveAxis !== 'y') moveSign *= cameraAxes[clickedFace].direction;
        if (moveAxis === 'x') moveSign *= -1;

        console.log({ moveAxis, dragSign, clickedFaceDirection: cameraAxes[clickedFace].direction });

        return {
            axisLabel: moveAxis,
            axisValues: [cubiePosition[moveAxis] as AxisValue],
            targetTheta: moveMagnitude * dragSign * moveSign,
        };
    }

    // this is very ugly and I will look for a way to clean it up later
    // it also doesn't work great when looking at the top or bottom face
    if (clickedFace === FACE.FRONT) {
        if (dragVector.y !== 0) {
            const moveAxis = cameraAxes.right.axisLabel;
            return {
                axisLabel: moveAxis,
                axisValues: [cubiePosition[moveAxis] as AxisValue],
                targetTheta: -moveMagnitude * dragVector.y * cameraAxes.right.direction,
            };
        } else if (dragVector.x !== 0) {
            const moveAxis = cameraAxes.up.axisLabel;
            return {
                axisLabel: moveAxis,
                axisValues: [cubiePosition[moveAxis] as AxisValue],
                targetTheta: moveMagnitude * dragVector.x * cameraAxes.up.direction,
            };
        }
    } else if (clickedFace === FACE.RIGHT) {
        if (dragVector.y !== 0) {
            const moveAxis = cameraAxes.front.axisLabel;
            return {
                axisLabel: moveAxis,
                axisValues: [cubiePosition[moveAxis] as AxisValue],
                targetTheta: moveMagnitude * dragVector.y * cameraAxes.front.direction,
            };
        } else if (dragVector.x !== 0) {
            const moveAxis = cameraAxes.up.axisLabel;
            return {
                axisLabel: moveAxis,
                axisValues: [cubiePosition[moveAxis] as AxisValue],
                targetTheta: moveMagnitude * dragVector.x * cameraAxes.up.direction,
            };
        }
    } else if (clickedFace === FACE.LEFT) {
        if (dragVector.y !== 0) {
            const moveAxis = cameraAxes.front.axisLabel;
            return {
                axisLabel: moveAxis,
                axisValues: [cubiePosition[moveAxis] as AxisValue],
                targetTheta: -moveMagnitude * dragVector.y * cameraAxes.front.direction,
            };
        } else if (dragVector.x !== 0) {
            const moveAxis = cameraAxes.up.axisLabel;
            return {
                axisLabel: moveAxis,
                axisValues: [cubiePosition[moveAxis] as AxisValue],
                targetTheta: moveMagnitude * dragVector.x * cameraAxes.up.direction,
            };
        }
    } else if (clickedFace === FACE.UP) {
        if (dragVector.y !== 0) {
            const moveAxis = cameraAxes.right.axisLabel;
            return {
                axisLabel: moveAxis,
                axisValues: [cubiePosition[moveAxis] as AxisValue],
                targetTheta: -moveMagnitude * dragVector.y * cameraAxes.right.direction,
            };
        } else if (dragVector.x !== 0) {
            const moveAxis = cameraAxes.front.axisLabel;
            return {
                axisLabel: moveAxis,
                axisValues: [cubiePosition[moveAxis] as AxisValue],
                targetTheta: -moveMagnitude * dragVector.x * cameraAxes.front.direction,
            };
        }
    } else if (clickedFace === FACE.DOWN) {
        if (dragVector.y !== 0) {
            const moveAxis = cameraAxes.right.axisLabel;
            return {
                axisLabel: moveAxis,
                axisValues: [cubiePosition[moveAxis] as AxisValue],
                targetTheta: -moveMagnitude * dragVector.y * cameraAxes.right.direction,
            };
        } else if (dragVector.x !== 0) {
            const moveAxis = cameraAxes.front.axisLabel;
            return {
                axisLabel: moveAxis,
                axisValues: [cubiePosition[moveAxis] as AxisValue],
                targetTheta: moveMagnitude * dragVector.x * cameraAxes.front.direction,
            };
        }
    }

    return null;
};
