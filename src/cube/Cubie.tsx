import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { roundedBoxGeometry } from './geometries/roundedBoxGeometry';
import type { StickerProps } from './Sticker';
import { AxisVector, Color, HALF_PI, NEGATIVE, POSITIVE } from './constants';
import Sticker from './Sticker';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectCubieMoves,
    selectMoveBuffer,
} from '../store/moves/movesSelector';
import { getRotationMatrix } from './utils/rotationUtils';
import { getVector3String } from './utils/vectorUtils';
import { clearCubieMove } from '../store/moves/movesSlice';
import { moveToRotationMatrix } from './utils/moveUtils';

export type CubieProps = {
    position: THREE.Vector3;
};

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

const Cubie = ({ position }: CubieProps) => {
    const cubieRef = useRef<THREE.Mesh>(null!);
    const dispatch = useDispatch();

    const cubieMoves = useSelector(selectCubieMoves);

    const [highlighted, setHighlighted] = useState<boolean>(false);

    const posString = getVector3String(cubieRef?.current?.position);

    useEffect(() => {
        const move = cubieMoves[posString];
        if (move) {
            const rotationMatrix = moveToRotationMatrix(move, HALF_PI);

            const nextPosition = cubieRef.current.position.clone();
            nextPosition.applyMatrix3(rotationMatrix);

            cubieRef.current.position.x = Math.round(nextPosition.x);
            cubieRef.current.position.y = Math.round(nextPosition.y);
            cubieRef.current.position.z = Math.round(nextPosition.z);

            dispatch(clearCubieMove(posString));
        }
    }, [cubieMoves]);

    // const stickerPropsList = getStickerProps(coords);

    return (
        <group>
            <mesh
                geometry={roundedBoxGeometry}
                position={position}
                ref={cubieRef}
                onClick={e => {
                    e.stopPropagation();
                    setHighlighted(prevHighlighted => !prevHighlighted);
                }}
            >
                <meshStandardMaterial color={highlighted ? 'red' : 'black'} />
            </mesh>
            {/* {stickerPropsList.map(stickerProps => (
                <Sticker {...stickerProps} key={JSON.stringify(stickerProps)} />
            ))} */}
        </group>
    );
};

export default Cubie;
