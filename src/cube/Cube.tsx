import { CUBIE_POSITIONS } from './constants';
import Cubie from './Cubie';
import { getVector3String } from './utils/stringUtils';
import { useEffect, type RefObject } from 'react';
import { useIsActiveMove, useMovesActions, useNextMove } from '../store/moves/store';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useEventListeners } from './hooks/useEventListeners';

export interface CubeProps {
    controlsRef: RefObject<OrbitControls>;
}

const Cube = ({ controlsRef }: CubeProps) => {
    const nextMove = useNextMove();
    const isActiveMove = useIsActiveMove();
    const { executeMove, dequeueMove } = useMovesActions();

    useEventListeners(controlsRef);

    const shouldExecuteNextMove = !isActiveMove && nextMove;

    useEffect(() => {
        if (shouldExecuteNextMove) {
            executeMove(nextMove);
            dequeueMove();
        }
    }, [shouldExecuteNextMove, nextMove]);

    return (
        <group>
            {CUBIE_POSITIONS.map(position => (
                <Cubie position={position} controlsRef={controlsRef} key={getVector3String(position)} />
            ))}
        </group>
    );
};

export default Cube;
