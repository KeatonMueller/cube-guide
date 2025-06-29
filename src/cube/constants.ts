import * as THREE from 'three';
import { getStickerLocationString, getVector3String } from './utils/stringUtils';

export const CUBIE_LENGTH = 1;
export const HALF_CUBIE_LENGTH = CUBIE_LENGTH * 0.5;
export const STICKER_LENGTH = CUBIE_LENGTH * 0.85;
export const EPSILON = 0.001;
export const ANIMATION_SPEED = 7;

export const POSITIVE = 'POSITIVE';
export const NEGATIVE = 'NEGATIVE';

/**
 * Axis vector enum
 */
export const AxisVector = {
    [POSITIVE]: {
        X: new THREE.Vector3(1, 0, 0),
        Y: new THREE.Vector3(0, 1, 0),
        Z: new THREE.Vector3(0, 0, 1),
    },
    [NEGATIVE]: {
        X: new THREE.Vector3(-1, 0, 0),
        Y: new THREE.Vector3(0, -1, 0),
        Z: new THREE.Vector3(0, 0, -1),
    },
} as const;

/**
 * Labels for each axis. Values match the property names of THREE.Vector3s.
 */
export const AxisLabel = {
    X: 'x',
    Y: 'y',
    Z: 'z',
} as const;
export type TAxisLabel = typeof AxisLabel.X | typeof AxisLabel.Y | typeof AxisLabel.Z;

export type AxisValue = -1 | 0 | 1;

export const AXIS_LABEL_TO_VECTOR = {
    [AxisLabel.X]: AxisVector[POSITIVE].X,
    [AxisLabel.Y]: AxisVector[POSITIVE].Y,
    [AxisLabel.Z]: AxisVector[POSITIVE].Z,
};

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
        const axisDirection = x > 0 ? POSITIVE : NEGATIVE;
        STICKER_LOCATIONS.push({
            cubiePosition,
            facingVector: AxisVector[axisDirection].X,
        });
    }

    if (y !== 0) {
        const axisDirection = y > 0 ? POSITIVE : NEGATIVE;
        STICKER_LOCATIONS.push({
            cubiePosition,
            facingVector: AxisVector[axisDirection].Y,
        });
    }

    if (z !== 0) {
        const axisDirection = z > 0 ? POSITIVE : NEGATIVE;
        STICKER_LOCATIONS.push({
            cubiePosition,
            facingVector: AxisVector[axisDirection].Z,
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

// half pi is a quarter turn in radians, which is something we'll
// be doing a lot of so store a convenience constant
export const HALF_PI = Math.PI * 0.5;

export const Layer = {
    F: 'F',
    B: 'B',
    U: 'U',
    D: 'D',
    R: 'R',
    L: 'L',
    M: 'M',
    E: 'E',
    S: 'S',
} as const;
export type TLayer = 'F' | 'B' | 'U' | 'D' | 'R' | 'L' | 'M' | 'E' | 'S';

// A move consists of a rotation axis, an axis identifier (-1, 0, 1), and a target theta
export type Move = {
    axisLabel: TAxisLabel;
    axisValues: AxisValue[];
    targetTheta: number;
};

export const MoveMap: Record<string, Move> = {
    f: {
        axisLabel: AxisLabel.Z,
        axisValues: [1],
        targetTheta: -HALF_PI,
    },
    F: {
        axisLabel: AxisLabel.Z,
        axisValues: [1],
        targetTheta: HALF_PI,
    },
    b: {
        axisLabel: AxisLabel.Z,
        axisValues: [-1],
        targetTheta: HALF_PI,
    },
    B: {
        axisLabel: AxisLabel.Z,
        axisValues: [-1],
        targetTheta: -HALF_PI,
    },
    u: {
        axisLabel: AxisLabel.Y,
        axisValues: [1],
        targetTheta: -HALF_PI,
    },
    U: {
        axisLabel: AxisLabel.Y,
        axisValues: [1],
        targetTheta: HALF_PI,
    },
    d: {
        axisLabel: AxisLabel.Y,
        axisValues: [-1],
        targetTheta: HALF_PI,
    },
    D: {
        axisLabel: AxisLabel.Y,
        axisValues: [-1],
        targetTheta: -HALF_PI,
    },
    r: {
        axisLabel: AxisLabel.X,
        axisValues: [1],
        targetTheta: -HALF_PI,
    },
    R: {
        axisLabel: AxisLabel.X,
        axisValues: [1],
        targetTheta: HALF_PI,
    },
    l: {
        axisLabel: AxisLabel.X,
        axisValues: [-1],
        targetTheta: HALF_PI,
    },
    L: {
        axisLabel: AxisLabel.X,
        axisValues: [-1],
        targetTheta: -HALF_PI,
    },
    m: {
        axisLabel: AxisLabel.X,
        axisValues: [0],
        targetTheta: HALF_PI,
    },
    M: {
        axisLabel: AxisLabel.X,
        axisValues: [0],
        targetTheta: -HALF_PI,
    },
    e: {
        axisLabel: AxisLabel.Y,
        axisValues: [0],
        targetTheta: HALF_PI,
    },
    E: {
        axisLabel: AxisLabel.Y,
        axisValues: [0],
        targetTheta: -HALF_PI,
    },
    s: {
        axisLabel: AxisLabel.Z,
        axisValues: [0],
        targetTheta: -HALF_PI,
    },
    S: {
        axisLabel: AxisLabel.Z,
        axisValues: [0],
        targetTheta: HALF_PI,
    },
    x: {
        axisLabel: AxisLabel.X,
        axisValues: [-1, 0, 1],
        targetTheta: -HALF_PI,
    },
    X: {
        axisLabel: AxisLabel.X,
        axisValues: [-1, 0, 1],
        targetTheta: HALF_PI,
    },
    y: {
        axisLabel: AxisLabel.Y,
        axisValues: [-1, 0, 1],
        targetTheta: -HALF_PI,
    },
    Y: {
        axisLabel: AxisLabel.Y,
        axisValues: [-1, 0, 1],
        targetTheta: HALF_PI,
    },
    z: {
        axisLabel: AxisLabel.Z,
        axisValues: [-1, 0, 1],
        targetTheta: -HALF_PI,
    },
    Z: {
        axisLabel: AxisLabel.Z,
        axisValues: [-1, 0, 1],
        targetTheta: HALF_PI,
    },
};
