import * as THREE from 'three';
import type { Camera, ThreeEvent } from '@react-three/fiber';
import { AXIS_LABEL, type AxisLabel, type DirectedAxis } from '../constants';
import { UP_AXIS_ROTATION_MAP, type CameraAxes } from './facingUtils';
import { directedAxisEqual } from './typeUtils';

/**
 * From the given pointer event from clicking on a Cubie, find the facing vector
 * based on the event's normal. Determined simply by finding the component with
 * the largest magnitude.
 */
export const getFacingVector = (e: ThreeEvent<PointerEvent>): THREE.Vector3 | null => {
    if (!e.normal) return null;

    const normal = e.normal;

    let facingAxis: AxisLabel = 'x';
    let axisSign = Math.sign(normal.x);
    let largestAmount = Math.abs(normal.x);

    for (const axisLabel of Object.values(AXIS_LABEL)) {
        const amount = Math.abs(normal[axisLabel]);
        if (amount > largestAmount) {
            largestAmount = amount;
            facingAxis = axisLabel;
            axisSign = Math.sign(normal[axisLabel]);
        }
    }

    const facingVector = new THREE.Vector3();
    facingVector[facingAxis] = axisSign;
    return facingVector;
};

const centerVector2 = (vector: THREE.Vector2, canvas: HTMLCanvasElement): THREE.Vector2 => {
    return new THREE.Vector2(vector.x - canvas.clientWidth / 2, vector.y - canvas.clientHeight / 2);
};

/**
 * For the given move vector which is in the ThreeJS world coordinate system (and not the
 * screen coordinate system), calculate the drag vector based on which component of the vector
 * had the greatest magnitude of change.
 */
const getDragVectorFromMoveVector = (moveVector: THREE.Vector2): THREE.Vector2 => {
    const xDiff = Math.abs(moveVector.x);
    const yDiff = Math.abs(moveVector.y);
    const axis = xDiff > yDiff ? 'x' : 'y';

    const sign = Math.sign(moveVector[axis]);
    const dragVector = new THREE.Vector2();
    dragVector[axis] = sign;

    return dragVector;
};

/**
 * For the given initial and current positions of the pointer, return a unit vector
 * representing the direction of the mouse drag.
 */
export const getDragVector = (
    initPointerLocation: THREE.Vector2,
    currPointerLocation: THREE.Vector2,
    clickedDirectedAxis: DirectedAxis,
    cameraAxes: CameraAxes,
    camera: Camera,
    canvas: HTMLCanvasElement
): THREE.Vector2 => {
    // center the pointer locations to the middle of the canvas
    const centerCurr = centerVector2(currPointerLocation, canvas);
    const centerInit = centerVector2(initPointerLocation, canvas);

    // convert the move to a single vector
    // y coordinate has init-curr instead of curr-init so that up+right is positive and down+left is negative
    // (like threejs world coords) as opposed to down+right being positive (like screen coords)
    const pointerMoveVector = new THREE.Vector2(centerCurr.x - centerInit.x, centerInit.y - centerCurr.y);

    // if the front/back/right/left faces were clicked, simply compute the drag vector right away
    if (clickedDirectedAxis.axisLabel !== 'y') {
        return getDragVectorFromMoveVector(pointerMoveVector);
    }
    // otherwise if the up/down faces were clicked, we need to handle askew camera rotations

    // first find the theta val that corresponds to the direction the current "up" face is pointing.
    // theta values around a circle have a point where they flip from positive to negative pi, so
    // this list may have 1 or 2 values
    const upThetas: number[] = Object.entries(UP_AXIS_ROTATION_MAP[clickedDirectedAxis.direction])
        .filter(([_, directedAxis]) => directedAxisEqual(directedAxis, cameraAxes.up))
        .map(([theta, _]) => Number(theta));

    // prettier-ignore
    const upTheta = upThetas.length === 1 ? upThetas[0]
            : Math.sign(upThetas[0]) === Math.sign(camera.rotation.z) ? upThetas[0]
            : upThetas[1];

    // then we rotate the pointer vector by the same amount the camera is mis-aligned from
    // the up face's theta, and after we can compute the drag vector
    const thetaDiff = camera.rotation.z - upTheta;
    pointerMoveVector.rotateAround({ x: 0, y: 0 }, thetaDiff);

    return getDragVectorFromMoveVector(pointerMoveVector);
};
