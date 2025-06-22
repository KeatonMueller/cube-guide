import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { roundedBoxGeometry } from './geometries/roundedBoxGeometry';
import type { StickerProps } from './Sticker';
import { Color, HALF_PI, STICKER_LOCATIONS } from './constants';
import Sticker from './Sticker';
import { useDispatch, useSelector } from 'react-redux';
import { selectCubieMoves } from '../store/moves/movesSelector';
import { getVector3String } from './utils/stringUtils';
import { clearCubieMove } from '../store/moves/movesSlice';
import { moveToRotationMatrix } from './utils/moveUtils';
import { applyMatrix3AndRound } from './utils/vectorUtils';

export type CubieProps = {
    position: THREE.Vector3;
};

const getStickerProps = (cubiePosition: THREE.Vector3): StickerProps[] => {
    return STICKER_LOCATIONS.filter(
        stickerLocation => stickerLocation.cubiePosition === cubiePosition
    ).map(stickerLocation => {
        const { facingVector } = stickerLocation;
        let color;
        if (facingVector.x !== 0) {
            color = facingVector.x > 0 ? Color.BLUE : Color.GREEN;
        } else if (facingVector.y !== 0) {
            color = facingVector.y > 0 ? Color.WHITE : Color.YELLOW;
        } else {
            color = facingVector.z > 0 ? Color.RED : Color.ORANGE;
        }
        return {
            location: stickerLocation,
            color,
        };
    });
};

const Cubie = ({ position }: CubieProps) => {
    const dispatch = useDispatch();
    const cubieRef = useRef<THREE.Mesh>(null!);

    const cubieMoves = useSelector(selectCubieMoves);

    const [highlighted, setHighlighted] = useState<boolean>(false);

    const posString = getVector3String(cubieRef?.current?.position);
    const move = cubieMoves[posString];

    useEffect(() => {
        if (move) {
            const rotationMatrix = moveToRotationMatrix(move, HALF_PI);

            const nextPosition = cubieRef.current.position.clone();
            applyMatrix3AndRound(nextPosition, rotationMatrix);
            cubieRef.current.position.copy(nextPosition);

            dispatch(clearCubieMove(posString));
        }
    }, [move]);

    const stickerPropsList = getStickerProps(position);

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
                <meshStandardMaterial color={highlighted ? 'gold' : 'black'} />
            </mesh>
            {stickerPropsList.map(stickerProps => (
                <Sticker {...stickerProps} key={JSON.stringify(stickerProps)} />
            ))}
        </group>
    );
};

export default Cubie;
