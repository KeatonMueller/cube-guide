import * as THREE from 'three';
import { CUBIE_LENGTH } from '../constants';

/**
 * Rounded Box code taken from forum: https://discourse.threejs.org/t/round-edged-box/1402
 */
const width = CUBIE_LENGTH; // width of box
const height = CUBIE_LENGTH; // height of box
const depth = CUBIE_LENGTH; // depth of box
const radius0 = 0.1; // radius of curve
const smoothness = 16; // smoothness of curve

// create a rounded box shape
const shape = new THREE.Shape();
const eps = 0.00001;
const radius = radius0 - eps;
shape.absarc(eps, eps, eps, -Math.PI / 2, -Math.PI, true);
shape.absarc(eps, height - radius * 2, eps, Math.PI, Math.PI / 2, true);
shape.absarc(
    width - radius * 2,
    height - radius * 2,
    eps,
    Math.PI / 2,
    0,
    true
);
shape.absarc(width - radius * 2, eps, eps, 0, -Math.PI / 2, true);

// create the geometry based on the shape
export const roundedBoxGeometry = new THREE.ExtrudeGeometry(shape, {
    depth: depth - radius0 * 2,
    bevelEnabled: true,
    bevelSegments: smoothness * 2,
    steps: 1,
    bevelSize: radius,
    bevelThickness: radius0,
    curveSegments: smoothness,
});
roundedBoxGeometry.center();
