import * as THREE from 'three';
import { useRef, useState, type RefObject } from 'react';
import { roundedBoxGeometry } from './geometries/roundedBoxGeometry';
import type { StickerProps } from './Sticker';
import { ANIMATION_SPEED, Color, CUBIE_LENGTH, HALF_PI, STICKER_LOCATIONS } from './constants';
import Sticker from './Sticker';
import { getVector3String } from './utils/stringUtils';
import { roundVector3 } from './utils/vectorUtils';
import { useFrame, useThree, type RootState } from '@react-three/fiber';
import { useCubieMoves, useMovesActions } from '../store/moves/store';
import { useIsVisible } from '../store/config/store';
import { getRotationMatrix } from './utils/rotationUtils';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { getFacingVector } from './utils/touchUtils';
import { useTouchActions } from '../store/touch/store';
import { updateRaycaster } from './utils/raycasterUtils';

export type CubieProps = {
    position: THREE.Vector3;
    controlsRef: RefObject<OrbitControls>;
    raycaster: THREE.Raycaster;
};

const getStickerProps = (cubiePosition: THREE.Vector3): StickerProps[] => {
    return STICKER_LOCATIONS.filter(stickerLocation => stickerLocation.cubiePosition === cubiePosition).map(
        stickerLocation => {
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
        }
    );
};

const Cubie = ({ position: initPosition, controlsRef, raycaster }: CubieProps) => {
    const cubieRef = useRef<THREE.Mesh>(null!);
    const boxRef = useRef<THREE.Mesh>(null!);
    const turnProgress = useRef<number>(0);
    // the cubieRef's position stores the real time position of the mesh, while this
    // stores the coordinate location of the mesh, only updated after a move finishes
    const fixedPosition = useRef<THREE.Vector3>(initPosition);

    const {
        camera,
        gl: { domElement },
    } = useThree();

    const isVisible = useIsVisible();
    const cubieMoves = useCubieMoves();
    const { clearCubieMove } = useMovesActions();
    const { setPointerSelection, setPointerPosition } = useTouchActions();

    const [highlighted, setHighlighted] = useState<boolean>(false);

    const posString = getVector3String(fixedPosition.current);
    const move = cubieMoves[posString];

    useFrame((_: RootState, delta: number) => {
        if (!move || !isVisible) return;
        const { axisLabel, targetTheta } = move;

        const sign = Math.sign(targetTheta);
        const deltaTheta = sign * delta * ANIMATION_SPEED;
        const rotationMatrix = getRotationMatrix(move.axisLabel, deltaTheta);

        const nextPosition = cubieRef.current.position.clone();
        nextPosition.applyMatrix3(rotationMatrix);
        cubieRef.current.position.copy(nextPosition);

        turnProgress.current += deltaTheta;
        cubieRef.current.rotation[axisLabel] += deltaTheta;

        if (Math.abs(turnProgress.current + deltaTheta) >= Math.abs(targetTheta)) {
            // if the animation that just completed was a full quarter turn,
            // round the current position vector and store it
            if (Math.abs(targetTheta) === HALF_PI) {
                roundVector3(cubieRef.current.position);
                fixedPosition.current = cubieRef.current.position.clone();
                cubieRef.current.rotation[axisLabel] = 0;
            } else {
                console.error('This should never happen, target theta was', targetTheta);
            }
            // reset turn tracker and flag move as complete
            turnProgress.current = 0;
            clearCubieMove(posString);
        }
    });

    const stickerPropsList = getStickerProps(initPosition);

    return (
        <group>
            {/* rounded box geometry mesh for visual */}
            <mesh
                geometry={roundedBoxGeometry}
                position={[initPosition.x, initPosition.y, initPosition.z]}
                ref={cubieRef}
            >
                <meshStandardMaterial
                    color={highlighted ? 'gold' : 'black'}
                    polygonOffset={true}
                    polygonOffsetFactor={1}
                    polygonOffsetUnits={1}
                />
            </mesh>
            {/* standard box geometry mesh for click detection */}
            <mesh
                ref={boxRef}
                position={[initPosition.x, initPosition.y, initPosition.z]}
                onPointerDown={e => {
                    e.stopPropagation();
                    controlsRef.current.enabled = false;

                    const facingVector = getFacingVector(e);
                    updateRaycaster(e, domElement, camera, raycaster);
                    const intersection = raycaster.intersectObject(boxRef.current);

                    if (!facingVector || !intersection.length) return;

                    setPointerSelection({
                        cubiePosition: initPosition,
                        facingVector,
                    });
                    setPointerPosition(intersection[0].point);
                }}
            >
                <boxGeometry args={[CUBIE_LENGTH, CUBIE_LENGTH, CUBIE_LENGTH]} />
                <meshStandardMaterial transparent={true} opacity={0} />
            </mesh>
            {stickerPropsList.map(stickerProps => (
                <Sticker {...stickerProps} key={JSON.stringify(stickerProps)} />
            ))}
        </group>
    );
};

export default Cubie;
