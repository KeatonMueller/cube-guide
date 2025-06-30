import { CUBIE_POSITIONS, MoveMap } from './constants';
import Cubie from './Cubie';
import { getVector3String } from './utils/stringUtils';
import { useEffect } from 'react';
import { useIsActiveMove, useMovesActions, useNextMove } from '../store/moves/store';
import { keyToMove } from './utils/moveUtils';
import { useThree } from '@react-three/fiber';

const Cube = () => {
    const { camera } = useThree();
    const nextMove = useNextMove();
    const isActiveMove = useIsActiveMove();
    const { executeMove, dequeueMove, queueMove } = useMovesActions();

    const shouldExecuteNextMove = !isActiveMove && nextMove;

    useEffect(() => {
        if (shouldExecuteNextMove) {
            executeMove(nextMove);
            dequeueMove();
        }
    }, [shouldExecuteNextMove, nextMove]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent): void => {
            const move = keyToMove(e.key, camera);
            if (move) {
                queueMove(move);
            }
            // if (MoveMap[e.key]) {
            //     queueMove(MoveMap[e.key]);
            // }
        };
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    return (
        <group onPointerDown={() => console.log('touch cube')} onPointerUp={() => console.log('release cube')}>
            {CUBIE_POSITIONS.map(position => (
                <Cubie position={position} key={getVector3String(position)} />
            ))}
        </group>
    );
};

export default Cube;
