import { useRef } from 'react';
import * as THREE from 'three';
import { roundedBoxGeometry } from './roundedBoxGeometry';
import type { Coords } from './types';

export interface CubieProps {
    coords: Coords;
}
const Cubie = ({ coords }: CubieProps) => {
    const meshRef = useRef<THREE.Mesh>(null!);

    return (
        <mesh
            geometry={roundedBoxGeometry}
            ref={meshRef}
            position={[coords.x, coords.y, coords.z]}
        >
            <meshStandardMaterial color="black" />
        </mesh>
    );
};

export default Cubie;
