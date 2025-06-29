import * as THREE from 'three';
import { getStickerLocationString, getVector3String } from './utils/stringUtils';

// half pi is a quarter turn in radians, which is something we'll
// be doing a lot of so store a convenience constant
export const HALF_PI = Math.PI * 0.5;
export const CUBIE_LENGTH = 1;
export const HALF_CUBIE_LENGTH = CUBIE_LENGTH * 0.5;
export const STICKER_LENGTH = CUBIE_LENGTH * 0.85;
export const EPSILON = 0.001;
export const ANIMATION_SPEED = 7;

/**
 * Labels for each axis. Values match the property names of THREE.Vector3s.
 */
export type AxisLabel = 'x' | 'y' | 'z';

/**
 * Axis vectors
 */
export const AxisVector: Record<AxisLabel, THREE.Vector3> = {
    x: new THREE.Vector3(1, 0, 0),
    y: new THREE.Vector3(0, 1, 0),
    z: new THREE.Vector3(0, 0, 1),
} as const;

export type AxisValue = -1 | 0 | 1;

/**
 * Positions of all the cubies in 3D space represented as Vector3s.
 */
export const CUBIE_POSITIONS: THREE.Vector3[] = [];

for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
            if (x !== 0 || y !== 0 || z !== 0) CUBIE_POSITIONS.push(new THREE.Vector3(x, y, z));
        }
    }
}

/**
 * String representations of the CUBIE_POSITIONS array.
 */
export const CUBIE_POSITION_STRINGS: string[] = CUBIE_POSITIONS.map(position => getVector3String(position));

/**
 * Type representing an individual sticker location.
 * Stickers are identified by the position of their cubie, and the direction
 * they are facing.
 */
export type StickerLocation = {
    cubiePosition: THREE.Vector3;
    facingVector: THREE.Vector3;
};

/**
 * Locations of all the stickers.
 */
export const STICKER_LOCATIONS: StickerLocation[] = [];

CUBIE_POSITIONS.forEach(cubiePosition => {
    const { x, y, z } = cubiePosition;
    if (x !== 0) {
        STICKER_LOCATIONS.push({
            cubiePosition,
            facingVector: AxisVector.x.clone().multiplyScalar(x),
        });
    }

    if (y !== 0) {
        STICKER_LOCATIONS.push({
            cubiePosition,
            facingVector: AxisVector.y.clone().multiplyScalar(y),
        });
    }

    if (z !== 0) {
        STICKER_LOCATIONS.push({
            cubiePosition,
            facingVector: AxisVector.z.clone().multiplyScalar(z),
        });
    }
});

/**
 * String representations of the STICKER_LOCATIONS array.
 */
export const STICKER_LOCATION_STRINGS: string[] = STICKER_LOCATIONS.map(stickerLocation =>
    getStickerLocationString(stickerLocation)
);

export const Color = {
    WHITE: 0xffffff,
    YELLOW: 0xffff00,
    RED: 0xff0000,
    ORANGE: 0xff9900,
    BLUE: 0x0000ff,
    GREEN: 0x00ff00,
} as const;

// A move consists of a rotation axis, an axis identifier (-1, 0, 1), and a target theta
export type Move = {
    axisLabel: AxisLabel;
    axisValues: AxisValue[];
    targetTheta: number;
};

export const MoveMap: Record<string, Move> = {
    f: {
        axisLabel: 'z',
        axisValues: [1],
        targetTheta: -HALF_PI,
    },
    F: {
        axisLabel: 'z',
        axisValues: [1],
        targetTheta: HALF_PI,
    },
    b: {
        axisLabel: 'z',
        axisValues: [-1],
        targetTheta: HALF_PI,
    },
    B: {
        axisLabel: 'z',
        axisValues: [-1],
        targetTheta: -HALF_PI,
    },
    u: {
        axisLabel: 'y',
        axisValues: [1],
        targetTheta: -HALF_PI,
    },
    U: {
        axisLabel: 'y',
        axisValues: [1],
        targetTheta: HALF_PI,
    },
    d: {
        axisLabel: 'y',
        axisValues: [-1],
        targetTheta: HALF_PI,
    },
    D: {
        axisLabel: 'y',
        axisValues: [-1],
        targetTheta: -HALF_PI,
    },
    r: {
        axisLabel: 'x',
        axisValues: [1],
        targetTheta: -HALF_PI,
    },
    R: {
        axisLabel: 'x',
        axisValues: [1],
        targetTheta: HALF_PI,
    },
    l: {
        axisLabel: 'x',
        axisValues: [-1],
        targetTheta: HALF_PI,
    },
    L: {
        axisLabel: 'x',
        axisValues: [-1],
        targetTheta: -HALF_PI,
    },
    m: {
        axisLabel: 'x',
        axisValues: [0],
        targetTheta: HALF_PI,
    },
    M: {
        axisLabel: 'x',
        axisValues: [0],
        targetTheta: -HALF_PI,
    },
    e: {
        axisLabel: 'y',
        axisValues: [0],
        targetTheta: HALF_PI,
    },
    E: {
        axisLabel: 'y',
        axisValues: [0],
        targetTheta: -HALF_PI,
    },
    s: {
        axisLabel: 'z',
        axisValues: [0],
        targetTheta: -HALF_PI,
    },
    S: {
        axisLabel: 'z',
        axisValues: [0],
        targetTheta: HALF_PI,
    },
    x: {
        axisLabel: 'x',
        axisValues: [-1, 0, 1],
        targetTheta: -HALF_PI,
    },
    X: {
        axisLabel: 'x',
        axisValues: [-1, 0, 1],
        targetTheta: HALF_PI,
    },
    y: {
        axisLabel: 'y',
        axisValues: [-1, 0, 1],
        targetTheta: -HALF_PI,
    },
    Y: {
        axisLabel: 'y',
        axisValues: [-1, 0, 1],
        targetTheta: HALF_PI,
    },
    z: {
        axisLabel: 'z',
        axisValues: [-1, 0, 1],
        targetTheta: -HALF_PI,
    },
    Z: {
        axisLabel: 'z',
        axisValues: [-1, 0, 1],
        targetTheta: HALF_PI,
    },
};
