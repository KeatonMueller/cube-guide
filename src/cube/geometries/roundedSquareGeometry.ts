import * as THREE from 'three';
import { STICKER_LENGTH } from '../constants';

/**
 * Rounded square code taken from three.js examples: https://threejs.org/examples/#webgl_geometry_shapes
 */
// create a new shape and manually construct a rounded square
const shape = new THREE.Shape();
const pos = 0; // the initial x and y coordinate of the square
const size = STICKER_LENGTH; // side length of the rounded square
const radius = 0.15; // radius of the curves in the corners of the square
// draw left side
shape.moveTo(pos, pos + radius);
shape.lineTo(pos, pos + size - radius);
// curve and draw top side
shape.quadraticCurveTo(pos, pos + size, pos + radius, pos + size);
shape.lineTo(pos + size - radius, pos + size);
// curve and draw right side
shape.quadraticCurveTo(pos + size, pos + size, pos + size, pos + size - radius);
shape.lineTo(pos + size, pos + radius);
// curve and draw bottom side
shape.quadraticCurveTo(pos + size, pos, pos + size - radius, pos);
shape.lineTo(pos + radius, pos);
// draw final curve connecting to left side
shape.quadraticCurveTo(pos, pos, pos, pos + radius);

// create a geometry from the rounded square shape
export const roundedSquareGeometry = new THREE.ShapeGeometry(shape);
roundedSquareGeometry.center();
