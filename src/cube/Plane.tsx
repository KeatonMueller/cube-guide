import * as THREE from 'three';
import type { DirectedAxis, StickerLocation } from './constants';
import { getStickerPosition, getStickerRotation } from './Sticker';
import { directedAxisToVector3 } from './utils/vectorUtils';
import { usePlanesActions } from '../store/planes/store';
import { getDirectedAxisString } from './utils/stringUtils';
import { useEffect, useRef } from 'react';

export interface PlaneProps {
    directedAxis: DirectedAxis;
}

const PLANE_SIZE = 1000;

const Plane = ({ directedAxis }: PlaneProps) => {
    const planeRef = useRef(null);
    const { registerPlane } = usePlanesActions();

    // convert the directed axis to the sticker location of the face's center
    // so that we can re-use the sticker code to position and rotate the plane
    const vector = directedAxisToVector3(directedAxis);
    const stickerLocation: StickerLocation = {
        cubiePosition: vector,
        facingVector: vector,
    };
    const position = getStickerPosition(stickerLocation);
    const rotation = getStickerRotation(stickerLocation.facingVector);

    useEffect(() => {
        if (planeRef.current) {
            registerPlane(getDirectedAxisString(directedAxis), planeRef.current);
        }
    }, [planeRef.current]);

    return (
        <mesh
            ref={planeRef}
            position={[position.x, position.y, position.z]}
            rotation={[rotation.x, rotation.y, rotation.z]}
        >
            <planeGeometry args={[PLANE_SIZE, PLANE_SIZE]} />
            <meshStandardMaterial color={'black'} opacity={0} transparent={true} side={THREE.DoubleSide} />
        </mesh>
    );
};

export default Plane;
