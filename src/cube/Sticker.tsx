import * as THREE from 'three';
import { useCallback, useRef } from 'react';
import { roundedSquareGeometry } from './geometries/roundedSquareGeometry';
import { ANIMATION_SPEED, AxisVector, EPSILON, HALF_CUBIE_LENGTH, HALF_PI, type StickerLocation } from './constants';
import { getStickerLocationString } from './utils/stringUtils';
import { applyMatrix3AndRound } from './utils/vectorUtils';
import { useMovesActions, useStickerMoves } from '../store/moves/store';
import { useFrame, type RootState } from '@react-three/fiber';
import { useIsVisible } from '../store/config/store';
import { getRotationMatrix } from './utils/rotationUtils';

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
    return new THREE.Euler(HALF_PI * facingVector.y, HALF_PI * facingVector.x, 0, THREE.Euler.DEFAULT_ORDER);
};

const Sticker = ({ location, color }: StickerProps) => {
    // initial position and rotation based on props
    // all future values are stored in local state and refs
    const initPosition = getStickerPosition(location);
    const initRotation = getStickerRotation(location.facingVector);

    // by definition, this stickerRef stores the real time position and rotation of the sticker
    const stickerRef = useRef<THREE.Mesh>(null!);
    // this ref stores the real time StickerLocation of the sticker, which gets translated
    // to position and rotation and applied to the stickerRef
    const realTimeLocation = useRef<StickerLocation>({
        cubiePosition: location.cubiePosition,
        facingVector: location.facingVector,
    });
    // this stores the coordinate location of the mesh, only updated after a move finishes
    const fixedLocation = useRef<StickerLocation>(location);
    // this ref tracks the progress of animating a turn
    const turnProgress = useRef<number>(0);

    const isVisible = useIsVisible();
    const stickerMoves = useStickerMoves();
    const { clearStickerMove } = useMovesActions();

    const locationString = getStickerLocationString(fixedLocation.current);
    const move = stickerMoves[locationString];

    // every frame, animate the ongoing turn if there is one
    useFrame((_: RootState, delta: number) => {
        if (!move || !isVisible) return;
        const { axisLabel, targetTheta } = move;

        const sign = Math.sign(targetTheta);
        const deltaTheta = sign * delta * ANIMATION_SPEED;
        const rotationMatrix = getRotationMatrix(move.axisLabel, deltaTheta);

        const nextPosition = realTimeLocation.current.cubiePosition.clone();
        nextPosition.applyMatrix3(rotationMatrix);

        const nextFacingVector = realTimeLocation.current.facingVector.clone();
        nextFacingVector.applyMatrix3(rotationMatrix);

        const nextLocation: StickerLocation = {
            cubiePosition: nextPosition,
            facingVector: nextFacingVector,
        };

        const nextStickerPosition = getStickerPosition(nextLocation);
        stickerRef.current.position.copy(nextStickerPosition);
        stickerRef.current.rotateOnWorldAxis(AxisVector[axisLabel], deltaTheta);
        realTimeLocation.current = nextLocation;

        turnProgress.current += deltaTheta;

        if (Math.abs(turnProgress.current) >= Math.abs(targetTheta)) {
            // if the animation that just completed was a full quarter turn,
            // round the current position vector and store it
            if (Math.abs(targetTheta) === HALF_PI) {
                performTurn();
            }
            // reset theta trackers and flag move as complete
            turnProgress.current = 0;
            clearStickerMove(locationString);
        }
    });

    // perform an instantaneous 90 degree turn
    const performTurn = useCallback(() => {
        if (!move) return;
        const rotationMatrix = getRotationMatrix(move.axisLabel, move.targetTheta);

        const nextPosition = fixedLocation.current.cubiePosition.clone();
        applyMatrix3AndRound(nextPosition, rotationMatrix);

        const nextFacingVector = fixedLocation.current.facingVector.clone();
        applyMatrix3AndRound(nextFacingVector, rotationMatrix);

        const nextLocation: StickerLocation = {
            cubiePosition: nextPosition,
            facingVector: nextFacingVector,
        };

        const nextStickerPosition = getStickerPosition(nextLocation);
        const nextStickerRotation = getStickerRotation(nextFacingVector);
        stickerRef.current.position.copy(nextStickerPosition);
        stickerRef.current.rotation.copy(nextStickerRotation);

        realTimeLocation.current = nextLocation;
        fixedLocation.current = nextLocation;
    }, [move, fixedLocation, stickerRef.current]);

    return (
        <mesh
            geometry={roundedSquareGeometry}
            position={[initPosition.x, initPosition.y, initPosition.z]}
            rotation={[initRotation.x, initRotation.y, initRotation.z]}
            ref={stickerRef}
            userData={{ locationString }}
        >
            <meshBasicMaterial color={color} side={THREE.DoubleSide} />
        </mesh>
    );
};

export default Sticker;
