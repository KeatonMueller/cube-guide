import { useRef } from 'react';
import * as THREE from 'three';
import { roundedBoxGeometry } from './geometries/roundedBoxGeometry';
import type { StickerProps } from './Sticker';
import { AxisVector, Color, NEGATIVE, POSITIVE } from './constants';
import Sticker from './Sticker';

export interface CubieProps {
    coords: THREE.Vector3Like;
}

/**
 * For the given set of initial coordinates of a cubie, get the props for all the stickers
 * that attach to that cubie
 */
const getStickerProps = (coords: THREE.Vector3Like): StickerProps[] => {
    const { x, y, z } = coords;
    const stickerProps: StickerProps[] = [];

    if (x !== 0) {
        const direction = x > 0 ? POSITIVE : NEGATIVE;
        const color = x > 0 ? Color.BLUE : Color.GREEN;
        stickerProps.push({
            coords,
            facingVector: AxisVector[direction].X,
            color,
        });
    }

    if (y !== 0) {
        const direction = y > 0 ? POSITIVE : NEGATIVE;
        const color = y > 0 ? Color.WHITE : Color.YELLOW;
        stickerProps.push({
            coords,
            facingVector: AxisVector[direction].Y,
            color,
        });
    }

    if (z !== 0) {
        const direction = z > 0 ? POSITIVE : NEGATIVE;
        const color = z > 0 ? Color.RED : Color.ORANGE;
        stickerProps.push({
            coords,
            facingVector: AxisVector[direction].Z,
            color,
        });
    }

    return stickerProps;
};

const Cubie = ({ coords }: CubieProps) => {
    const cubieRef = useRef<THREE.Mesh>(null!);
    const { x, y, z } = coords;
    const stickerPropsList = getStickerProps(coords);

    return (
        <group>
            <mesh
                geometry={roundedBoxGeometry}
                position={[x, y, z]}
                ref={cubieRef}
            >
                <meshStandardMaterial color="black" />
            </mesh>
            {stickerPropsList.map(stickerProps => (
                <Sticker {...stickerProps} key={JSON.stringify(stickerProps)} />
            ))}
        </group>
    );
};

export default Cubie;
