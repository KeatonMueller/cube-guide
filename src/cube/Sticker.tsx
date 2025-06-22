import * as THREE from 'three';
import { useRef } from 'react';
import { roundedSquareGeometry } from './geometries/roundedSquareGeometry';
import { EPSILON, HALF_CUBIE_LENGTH, HALF_PI } from './constants';

export type StickerProps = {
    coords: THREE.Vector3Like;
    facingVector: THREE.Vector3;
    color: number;
};

/**
 * Get the sticker's position given its coords and facing vector.
 * Stickers get rendered in the exact center of a cubie, so they need to be translated
 * an additional half-cube-length in the direction they're facing (plus an epsilon so
 * they're not in the exact same plane as the cubie itself).
 */
const getPosition = (
    coords: THREE.Vector3Like,
    facingVector: THREE.Vector3
): THREE.Vector3Like => {
    return {
        x: coords.x + facingVector.x * (HALF_CUBIE_LENGTH + EPSILON),
        y: coords.y + facingVector.y * (HALF_CUBIE_LENGTH + EPSILON),
        z: coords.z + facingVector.z * (HALF_CUBIE_LENGTH + EPSILON),
    };
};

/**
 * We're using a double sided sticker material so if the sticker is "facing" the correct
 * way relative to its initial render doesn't really matter. Ex: a sticker facing right
 * could've been rotated +90 or -90 degrees to achieve that result; it's equivalent.
 *
 * This utility, given a unit vector of where the sticker is facing, returns the rotation
 * needed to face the sticker that way (or 180 degrees the other way, since it's the same).
 */
const getRotation = (facingVector: THREE.Vector3): THREE.Vector3Like => {
    return {
        x: HALF_PI * facingVector.y,
        y: HALF_PI * facingVector.x,
        z: 0,
    };
};

const Sticker = ({ coords, facingVector, color }: StickerProps) => {
    const stickerRef = useRef<THREE.Mesh>(null!);

    const position = getPosition(coords, facingVector);
    const rotation = getRotation(facingVector);

    return (
        <mesh
            geometry={roundedSquareGeometry}
            position={[position.x, position.y, position.z]}
            rotation={[rotation.x, rotation.y, rotation.z]}
            ref={stickerRef}
        >
            <meshBasicMaterial color={color} side={THREE.DoubleSide} />
        </mesh>
    );
};

export default Sticker;
