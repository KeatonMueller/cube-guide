import * as THREE from 'three';
import { CUBIE_POSITIONS, DIRECTED_AXES } from './constants';
import Cubie from './Cubie';
import { getVector3String } from './utils/stringUtils';
import { useEffect, type RefObject } from 'react';
import { useIsActiveMove, useMovesActions, useNextMove } from '../store/moves/store';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useEventListeners } from './hooks/useEventListeners';
import Plane from './Plane';
import { useRepr } from '../store/repr/store';

export interface CubeProps {
    controlsRef: RefObject<OrbitControls>;
}

const Cube = ({ controlsRef }: CubeProps) => {
    const nextMove = useNextMove();
    const isActiveMove = useIsActiveMove();
    const repr = useRepr();
    const { executeMove, dequeueMove } = useMovesActions();

    const raycaster = new THREE.Raycaster();
    useEventListeners(controlsRef, raycaster);

    const shouldExecuteNextMove = !isActiveMove && nextMove;

    useEffect(() => {
        if (shouldExecuteNextMove) {
            executeMove(nextMove);
            dequeueMove();
        }
    }, [shouldExecuteNextMove, nextMove]);

    useEffect(() => {
        let reprString = '';
        for (let i = 0; i < 6; i++) {
            for (let j = 0; j < 3; j++) {
                let line = '';
                for (let k = 0; k < 3; k++) {
                    const idx = i * 9 + j * 3 + k;
                    line += repr.charAt(idx);
                }
                reprString += line + '\n';
            }
            reprString += '\n';
        }
        console.log(reprString);
    }, [repr]);

    return (
        <group>
            {CUBIE_POSITIONS.map(position => (
                <Cubie
                    position={position}
                    controlsRef={controlsRef}
                    raycaster={raycaster}
                    key={getVector3String(position)}
                />
            ))}
            {DIRECTED_AXES.map(directedAxis => (
                <Plane directedAxis={directedAxis} />
            ))}
        </group>
    );
};

export default Cube;
