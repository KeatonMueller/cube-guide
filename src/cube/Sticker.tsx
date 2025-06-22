import * as THREE from 'three';
import { useEffect, useMemo, useRef, useState } from 'react';
import { roundedSquareGeometry } from './geometries/roundedSquareGeometry';
import {
    EPSILON,
    HALF_CUBIE_LENGTH,
    HALF_PI,
    type StickerLocation,
} from './constants';
import { useDispatch, useSelector } from 'react-redux';
import { selectStickerMoves } from '../store/moves/movesSelector';
import { clearStickerMove } from '../store/moves/movesSlice';
import { moveToRotationMatrix } from './utils/moveUtils';
import { getStickerLocationString } from './utils/stringUtils';
import { applyMatrix3AndRound } from './utils/vectorUtils';

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
const getStickerPosition = (location: StickerLocation): THREE.Vector3 => {
    const { cubiePosition, facingVector } = location;
    return new THREE.Vector3(
        cubiePosition.x + facingVector.x * (HALF_CUBIE_LENGTH + EPSILON),
        cubiePosition.y + facingVector.y * (HALF_CUBIE_LENGTH + EPSILON),
        cubiePosition.z + facingVector.z * (HALF_CUBIE_LENGTH + EPSILON)
    );
};

/**
 * We're using a double sided sticker material so if the sticker is "facing" the correct
 * way relative to its initial render doesn't really matter. Ex: a sticker facing right
 * could've been rotated +90 or -90 degrees to achieve that result; it's equivalent.
 *
 * This utility, given a unit vector of where the sticker is facing, returns the rotation
 * needed to face the sticker that way (or 180 degrees the other way, since it's the same).
 */
const getStickerRotation = (facingVector: THREE.Vector3): THREE.Euler => {
    return new THREE.Euler(
        HALF_PI * facingVector.y,
        HALF_PI * facingVector.x,
        0,
        THREE.Euler.DEFAULT_ORDER
    );
};

const Sticker = ({ location, color }: StickerProps) => {
    // initial position and rotation based on props
    // all future values are stored in local state and the stickerRef
    const initPosition = getStickerPosition(location);
    const initRotation = getStickerRotation(location.facingVector);

    const dispatch = useDispatch();
    const stickerRef = useRef<THREE.Mesh>(null!);
    const stickerMoves = useSelector(selectStickerMoves);

    const [stickerLocation, setStickerLocation] =
        useState<StickerLocation>(location);

    const locationString = getStickerLocationString(stickerLocation);
    const move = stickerMoves[locationString];

    useEffect(() => {
        if (move) {
            const rotationMatrix = moveToRotationMatrix(move, HALF_PI);

            const nextPosition = stickerLocation.cubiePosition.clone();
            applyMatrix3AndRound(nextPosition, rotationMatrix);

            const nextFacingVector = stickerLocation.facingVector.clone();
            applyMatrix3AndRound(nextFacingVector, rotationMatrix);

            const nextLocation: StickerLocation = {
                cubiePosition: nextPosition,
                facingVector: nextFacingVector,
            };

            const nextStickerPosition = getStickerPosition(nextLocation);
            const nextStickerRotation = getStickerRotation(nextFacingVector);
            stickerRef.current.position.copy(nextStickerPosition);
            stickerRef.current.rotation.copy(nextStickerRotation);

            setStickerLocation(nextLocation);
            dispatch(clearStickerMove(locationString));
        }
    }, [move]);

    return (
        <mesh
            geometry={roundedSquareGeometry}
            position={[initPosition.x, initPosition.y, initPosition.z]}
            rotation={[initRotation.x, initRotation.y, initRotation.z]}
            ref={stickerRef}
        >
            <meshBasicMaterial color={color} side={THREE.DoubleSide} />
        </mesh>
    );
};

export default Sticker;
