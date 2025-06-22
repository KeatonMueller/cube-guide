import * as THREE from 'three';
import { useRef } from 'react';
import { roundedSquareGeometry } from './geometries/roundedSquareGeometry';
import {
    EPSILON,
    HALF_CUBIE_LENGTH,
    HALF_PI,
    type StickerLocation,
} from './constants';

export type StickerProps = {
    location: StickerLocation;
    color: number;
};

/**
 * Get the sticker's 3D position given its location.
 * Stickers get rendered in the exact center of a cubie, so they need to be translated
 * an additional half cubie length in the direction they're facing (plus an epsilon so
 * they're not in the exact same plane as the cubie itself).
 */
const getStickerPosition = (location: StickerLocation): THREE.Vector3Like => {
    const { cubiePosition, facingVector } = location;
    return {
        x: cubiePosition.x + facingVector.x * (HALF_CUBIE_LENGTH + EPSILON),
        y: cubiePosition.y + facingVector.y * (HALF_CUBIE_LENGTH + EPSILON),
        z: cubiePosition.z + facingVector.z * (HALF_CUBIE_LENGTH + EPSILON),
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

const Sticker = ({ location, color }: StickerProps) => {
    const stickerRef = useRef<THREE.Mesh>(null!);

    const stickerPosition = getStickerPosition(location);
    const rotation = getRotation(location.facingVector);

    return (
        <mesh
            geometry={roundedSquareGeometry}
            position={[stickerPosition.x, stickerPosition.y, stickerPosition.z]}
            rotation={[rotation.x, rotation.y, rotation.z]}
            ref={stickerRef}
        >
            <meshBasicMaterial color={color} side={THREE.DoubleSide} />
        </mesh>
    );
};

export default Sticker;
