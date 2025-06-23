import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { roundedBoxGeometry } from './geometries/roundedBoxGeometry';
import type { StickerProps } from './Sticker';
import {
    ANIMATION_SPEED,
    Color,
    HALF_PI,
    STICKER_LOCATIONS,
} from './constants';
import Sticker from './Sticker';
import { useDispatch, useSelector } from 'react-redux';
import { selectCubieMoves } from '../store/moves/movesSelectors';
import { getVector3String } from './utils/stringUtils';
import { clearCubieMove } from '../store/moves/movesSlice';
import { moveToRotationMatrix } from './utils/moveUtils';
import { roundVector3 } from './utils/vectorUtils';
import { useFrame, type RootState } from '@react-three/fiber';

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

const Cubie = ({ position: initPosition }: CubieProps) => {
    const dispatch = useDispatch();
    const cubieRef = useRef<THREE.Mesh>(null!);

    const cubieMoves = useSelector(selectCubieMoves);

    const [highlighted, setHighlighted] = useState<boolean>(false);
    const [position, setPosition] = useState<THREE.Vector3>(initPosition);
    const [targetTheta, setTargetTheta] = useState<number>(0);

    const posString = getVector3String(position);
    const move = cubieMoves[posString];

    useEffect(() => {
        if (move && targetTheta === 0) {
            setTargetTheta(move.targetTheta);
        }
    }, [move]);

    useFrame((_: RootState, delta: number) => {
        if (move && targetTheta !== 0) {
            const { axisLabel } = move;

            const sign = targetTheta / Math.abs(targetTheta);
            const deltaTheta = sign * delta * ANIMATION_SPEED;
            const rotationMatrix = moveToRotationMatrix(move, deltaTheta);

            const nextPosition = cubieRef.current.position.clone();
            nextPosition.applyMatrix3(rotationMatrix);
            cubieRef.current.position.copy(nextPosition);

            const nextTheta = cubieRef.current.rotation[axisLabel] + deltaTheta;
            cubieRef.current.rotation[axisLabel] = nextTheta;

            if (Math.abs(nextTheta) >= Math.abs(targetTheta)) {
                // if the animation that just completed was a full quarter turn,
                // round the current position vector and store it
                if (Math.abs(targetTheta) === HALF_PI) {
                    roundVector3(cubieRef.current.position);
                    setPosition(cubieRef.current.position);
                }
                // reset theta trackers and flag move as complete
                cubieRef.current.rotation[axisLabel] = 0;
                setTargetTheta(0);
                dispatch(clearCubieMove(posString));
            }
        }
    });

    const stickerPropsList = getStickerProps(initPosition);

    return (
        <group>
            <mesh
                geometry={roundedBoxGeometry}
                position={[initPosition.x, initPosition.y, initPosition.z]}
                ref={cubieRef}
                onClick={e => {
                    e.stopPropagation();
                    setHighlighted(prevHighlighted => !prevHighlighted);
                }}
            >
                <meshStandardMaterial color={highlighted ? 'gold' : 'black'} />
            </mesh>
            {/* {stickerPropsList.map(stickerProps => (
                <Sticker {...stickerProps} key={JSON.stringify(stickerProps)} />
            ))} */}
        </group>
    );
};

export default Cubie;
