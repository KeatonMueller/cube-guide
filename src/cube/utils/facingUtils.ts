import * as THREE from 'three';
import { AxisDirections, AxisLabels, AxisVector, HALF_PI, type AxisDirection, type DirectedAxis } from '../constants';
import { directedAxisToVector3 } from './vectorUtils';

/**
 * This map helps find which directed axis is the camera's "up" face **when
 * the camera is facing the top or bottom faces of the cube** (because if
 * it's facing any other side, the cube's up face is the camera's up face).
 *
 * map[direction][theta] = x is defined as follows:
 * - `direction` is the camera's front face direction (i.e. is camera looking at
 *    the cube's up or down face)
 * - `theta` is an angle corresponding to a directed axis
 * - `x` is the directed axis that would be the camera's up face if its
 *    z rotation is closest to theta
 *
 * Rotation values around a circle are like so:
 *
 *       PI & -PI
 *         ---
 *       /     \
 * PI/2 |       | -PI/2
 *       \     /
 *         ---
 *          0
 *
 * There is a point where it flips from positive to negative pi, so this map has
 * entries for both of them corresponding to the same directed axis
 */
const UP_AXIS_ROTATION_MAP: Record<AxisDirection, Record<number, DirectedAxis>> = {
    [1]: {
        [Math.PI]: { axisLabel: 'z', direction: 1 },
        [-Math.PI]: { axisLabel: 'z', direction: 1 },
        [-HALF_PI]: { axisLabel: 'x', direction: 1 },
        [0]: { axisLabel: 'z', direction: -1 },
        [HALF_PI]: { axisLabel: 'x', direction: -1 },
    },
    [-1]: {
        [Math.PI]: { axisLabel: 'z', direction: -1 },
        [-Math.PI]: { axisLabel: 'z', direction: -1 },
        [-HALF_PI]: { axisLabel: 'x', direction: 1 },
        [0]: { axisLabel: 'z', direction: 1 },
        [HALF_PI]: { axisLabel: 'x', direction: -1 },
    },
} as const;

/**
 * Find the axis of the "front" face of the cube from the camera's perspective.
 *
 * This is determined by checking which axis is closest to the camera's position.
 */
const findFrontAxis = (camera: THREE.Object3D): DirectedAxis => {
    let frontAxis: DirectedAxis | null = null;
    let closestDistance = Number.MAX_VALUE;

    for (const axisLabel of AxisLabels) {
        for (const direction of AxisDirections) {
            const directedAxis = { axisLabel, direction };
            const distance = camera.position.distanceTo(directedAxisToVector3(directedAxis));
            if (distance < closestDistance) {
                closestDistance = distance;
                frontAxis = directedAxis;
            }
        }
    }

    return frontAxis!;
};

/**
 * Find the axis of the "up" face of the cube from the camera's perspective.
 * Needs the result of calling findFrontAxis() to work.
 *
 * Since we're using OrbitControls, if the camera's front face is *not* the cube's
 * up or down face, then the camera's up face is simply the cube's up face (positive Y).
 *
 * Otherwise use the camera's Z rotation to determine the camera's up face.
 */
const findUpAxis = (camera: THREE.Object3D, frontAxis: DirectedAxis): DirectedAxis => {
    if (frontAxis.axisLabel !== 'y') {
        return {
            axisLabel: 'y',
            direction: 1,
        };
    }

    let upAxis: DirectedAxis | null = null;
    let smallestDifference = Number.MAX_VALUE;

    for (const theta in UP_AXIS_ROTATION_MAP[frontAxis.direction]) {
        const difference = Math.abs(parseFloat(theta) - camera.rotation.z);
        if (difference < smallestDifference) {
            smallestDifference = difference;
            upAxis = UP_AXIS_ROTATION_MAP[frontAxis.direction][theta];
        }
    }

    return upAxis!;
};

export type CameraAxes = {
    front: DirectedAxis;
    up: DirectedAxis;
};
export const findCameraAxes = (camera: THREE.Object3D): CameraAxes => {
    const frontAxis = findFrontAxis(camera);
    const upAxis = findUpAxis(camera, frontAxis);
    return {
        front: frontAxis,
        up: upAxis,
    };
};
