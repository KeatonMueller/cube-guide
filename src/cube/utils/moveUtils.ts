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
import { getDirectedAxisString, getVector3String } from './stringUtils';
import { directedAxisToVector3 } from './vectorUtils';
import type { Camera } from '@react-three/fiber';
import { getDragNormal } from './touchUtils';

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
 * DEFAULT_MOVE_SIGNS[moveAxis][clickedAxis] = defaultSign
 * Then multiply defaultSign by clickedAxis sign and drag sign, and the result
 * will be the sign of the rotation to complete the move.
 */
const DEFAULT_MOVE_SIGNS: Record<AxisLabel, Partial<Record<AxisLabel, number>>> = {
    x: {
        y: 1,
        z: -1,
    },
    y: {
        x: -1,
        z: 1,
    },
    z: {
        x: 1,
        y: -1,
    },
} as const;

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
    initPointerPosition: THREE.Vector3,
    pointerSelection: StickerLocation,
    _1: THREE.Vector2,
    _2: THREE.Vector2,
    camera: Camera,
    canvas: HTMLCanvasElement,
    raycaster: THREE.Raycaster,
    e: MouseEvent,
    planes: Record<string, THREE.Object3D>
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

    const pointer = new THREE.Vector2(
        (e.clientX / canvas.clientWidth) * 2 - 1,
        -(e.clientY / canvas.clientHeight) * 2 + 1
    );
    raycaster.setFromCamera(pointer, camera);
    const plane = planes[getDirectedAxisString(clickedDirectedAxis)];
    const intersection = raycaster.intersectObject(plane);
    const currPointerPosition = intersection[0].point;
    console.log('to', currPointerPosition);

    const dragNormal = getDragNormal(initPointerPosition, currPointerPosition);

    const moveAxis = Object.values(AXIS_LABEL).filter(
        axisLabel => axisLabel !== dragNormal.axisLabel && axisLabel !== clickedDirectedAxis.axisLabel
    )[0]!;

    const info: any = `
        clickedFace: ${clickedFace},
        clickedDirectedAxis: ${JSON.stringify(clickedDirectedAxis)},
        cubiePosition: ${getVector3String(cubiePosition)}
        facingVector: ${getVector3String(facingVector)}
        initPointerPosition: ${getVector3String(initPointerPosition)}
        currPointerPosition: ${getVector3String(currPointerPosition)}
        dragNormal: ${getDirectedAxisString(dragNormal)}
        moveAxis: ${moveAxis}
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

    const moveSign =
        DEFAULT_MOVE_SIGNS[moveAxis][clickedDirectedAxis.axisLabel]! *
        clickedDirectedAxis.direction *
        dragNormal.direction;

    return {
        axisLabel: moveAxis,
        axisValues: [cubiePosition[moveAxis] as AxisValue],
        targetTheta: moveMagnitude * moveSign,
    };
};
