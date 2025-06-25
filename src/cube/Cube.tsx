import { CUBIE_POSITIONS, MoveMap } from './constants';
import Cubie from './Cubie';
import { getVector3String } from './utils/stringUtils';
import { useEffect } from 'react';
import { useMovesStore } from '../store/moves/store';
import {
    selectMovesActions,
    selectIsActiveMove,
    selectNextMove,
} from '../store/moves/selectors';

const Cube = () => {
    const nextMove = useMovesStore(selectNextMove);
    const isActiveMove = useMovesStore(selectIsActiveMove);
    const { executeMove, dequeueMove, queueMove } =
        useMovesStore(selectMovesActions);

    const shouldExecuteNextMove = !isActiveMove && nextMove;

    useEffect(() => {
        if (shouldExecuteNextMove) {
            executeMove(nextMove);
            dequeueMove();
        }
    }, [shouldExecuteNextMove, nextMove]);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent): void => {
            if (MoveMap[e.key]) {
                queueMove(MoveMap[e.key]);
            }
        };
        document.addEventListener('keydown', onKeyDown);

        return () => {
            document.removeEventListener('keydown', onKeyDown);
        };
    }, []);

    return (
        <group>
            {CUBIE_POSITIONS.map(position => (
                <Cubie position={position} key={getVector3String(position)} />
            ))}
        </group>
    );
};

export default Cube;
