import { useFrame } from '@react-three/fiber';
import { CUBIE_POSITIONS, MoveMap, type Move } from './constants';
import Cubie from './Cubie';
import { getVector3String } from './utils/stringUtils';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectIsActiveMove,
    selectNextMove,
} from '../store/moves/movesSelectors';
import { dequeueMove, executeMove, queueMove } from '../store/moves/movesSlice';
import { useEffect } from 'react';

const Cube = () => {
    const dispatch = useDispatch();

    const nextMove: Move | null = useSelector(selectNextMove);
    const isActiveMove: boolean = useSelector(selectIsActiveMove);

    const shouldExecuteNextMove = !isActiveMove && nextMove;

    useFrame(() => {
        if (shouldExecuteNextMove) {
            dispatch(executeMove(nextMove));
            dispatch(dequeueMove());
        }
    });

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent): void => {
            if (MoveMap[e.key]) {
                dispatch(queueMove(MoveMap[e.key]));
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
