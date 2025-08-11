import * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import { AXIS_LABEL, type AxisLabel, type DirectedAxis, type Sign } from '../constants';

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

export const getDragNormal = (initPointerPosition: THREE.Vector3, currPointerPosition: THREE.Vector3): DirectedAxis => {
    let largestDiff: number = -1;
    let diffSign: Sign = 1;
    let diffAxis: AxisLabel = 'x';
    Object.values(AXIS_LABEL).forEach(axisLabel => {
        const diff = currPointerPosition[axisLabel] - initPointerPosition[axisLabel];
        const absDiff = Math.abs(diff);
        if (absDiff > largestDiff) {
            largestDiff = absDiff;
            diffSign = Math.sign(diff) as Sign;
            diffAxis = axisLabel;
        }
    });

    return {
        axisLabel: diffAxis,
        direction: diffSign,
    };
};
