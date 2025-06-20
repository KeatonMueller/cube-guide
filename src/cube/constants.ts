import * as THREE from 'three';

export const CUBIE_LENGTH = 1;
export const HALF_CUBIE_LENGTH = CUBIE_LENGTH * 0.5;
export const STICKER_LENGTH = CUBIE_LENGTH * 0.85;
export const EPSILON = 0.001;

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

export const Color = {
    WHITE: 0xffffff,
    YELLOW: 0xffff00,
    RED: 0xff0000,
    ORANGE: 0xff9900,
    BLUE: 0x0000ff,
    GREEN: 0x00ff00,
} as const;

export const QUARTER_TURN_RADIANS = Math.PI * 0.5;
