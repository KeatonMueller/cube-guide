import * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import { AXIS_LABEL, type AxisLabel } from '../constants';

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

/**
 * For the given initial and current positions of the pointer, return a unit vector
 * representing the direction of the mouse drag.
 *
 * This is determined simply by picking which component moved the greatest distance.
 */
export const getDragVector = (
    initPointerLocation: THREE.Vector2,
    currPointerLocation: THREE.Vector2
): THREE.Vector2 => {
    const xDiff = Math.abs(currPointerLocation.x - initPointerLocation.x);
    const yDiff = Math.abs(currPointerLocation.y - initPointerLocation.y);
    const axis = xDiff > yDiff ? 'x' : 'y';

    // we want up and right to be positive, and down and left to be negative (to match our 3D space)
    // since we're working with screen coordinates anchored in the top left though it's a little funky
    // (there's probably a better way to do this)
    const sign =
        axis === 'x'
            ? Math.sign(currPointerLocation.x - initPointerLocation.x)
            : Math.sign(initPointerLocation.y - currPointerLocation.y);

    const dragVector = new THREE.Vector2();
    dragVector[axis] = sign;

    return dragVector;
};
