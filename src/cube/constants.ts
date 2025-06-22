import * as THREE from 'three';
import { getVector3String } from './utils/vectorUtils';

export const CUBIE_LENGTH = 1;
export const HALF_CUBIE_LENGTH = CUBIE_LENGTH * 0.5;
export const STICKER_LENGTH = CUBIE_LENGTH * 0.85;
export const EPSILON = 0.001;

export const POSITIVE = 'POSITIVE';
export const NEGATIVE = 'NEGATIVE';

/**
 * Positions of all the cubies in 3D space represented as Vector3s
 */
export const CUBIE_POSITIONS: THREE.Vector3[] = [];

for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
            if (x !== 0 || y !== 0 || z !== 0)
                CUBIE_POSITIONS.push(new THREE.Vector3(x, y, z));
        }
    }
}

export const CUBIE_POSITION_STRINGS: string[] = CUBIE_POSITIONS.map(position =>
    getVector3String(position)
);

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

export const Direction = {
    NORMAL: 'NORMAL',
    INVERTED: 'INVERTED',
} as const;
export type TDirection = 'NORMAL' | 'INVERTED';

export const Variant = {
    NORMAL: 'NORMAL',
    WIDE: 'WIDE',
} as const;
export type TVariant = 'NORMAL' | 'WIDE';

// A move consists of a layer, a direction, and a variant
export type Move = {
    layer: TLayer;
    direction: TDirection;
    variant?: TVariant;
};

export const MoveMap: Record<string, Move> = {
    f: {
        layer: Layer.F,
        direction: Direction.NORMAL,
    },
    F: {
        layer: Layer.F,
        direction: Direction.INVERTED,
    },
    b: {
        layer: Layer.B,
        direction: Direction.NORMAL,
    },
    B: {
        layer: Layer.B,
        direction: Direction.INVERTED,
    },
    u: {
        layer: Layer.U,
        direction: Direction.NORMAL,
    },
    U: {
        layer: Layer.U,
        direction: Direction.INVERTED,
    },
    d: {
        layer: Layer.D,
        direction: Direction.NORMAL,
    },
    D: {
        layer: Layer.D,
        direction: Direction.INVERTED,
    },
    r: {
        layer: Layer.R,
        direction: Direction.NORMAL,
    },
    R: {
        layer: Layer.R,
        direction: Direction.INVERTED,
    },
    l: {
        layer: Layer.L,
        direction: Direction.NORMAL,
    },
    L: {
        layer: Layer.L,
        direction: Direction.INVERTED,
    },
};
