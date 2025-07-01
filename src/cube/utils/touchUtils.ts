import * as THREE from 'three';
import type { ThreeEvent } from '@react-three/fiber';
import { AxisLabels, AxisVector, type AxisLabel } from '../constants';

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

    for (const axisLabel of AxisLabels) {
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
