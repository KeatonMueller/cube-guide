import { useFrame } from '@react-three/fiber';
import { CUBIE_POSITIONS, type Move } from './constants';
import Cubie from './Cubie';
import { getVector3String } from './utils/vectorUtils';
import { useDispatch, useSelector } from 'react-redux';
import {
    selectCubieMovesEmpty,
    selectNextMove,
} from '../store/moves/movesSelector';
import { dequeueMove, executeMove } from '../store/moves/movesSlice';
import { useState } from 'react';

const Cube = () => {
    const dispatch = useDispatch();

    const nextMove: Move | null = useSelector(selectNextMove);
    const cubieMovesEmpty: boolean = useSelector(selectCubieMovesEmpty);

    const [activeMove, setActiveMove] = useState(false);

    const shouldExecuteNextMove = !activeMove && cubieMovesEmpty && nextMove;
    const moveFinished = activeMove && cubieMovesEmpty;

    useFrame(() => {
        if (shouldExecuteNextMove) {
            dispatch(executeMove(nextMove));
            dispatch(dequeueMove());
            setActiveMove(true);
        } else if (moveFinished) {
            setActiveMove(false);
        }
    });

    return (
        <group>
            {CUBIE_POSITIONS.map(position => (
                <Cubie position={position} key={getVector3String(position)} />
            ))}
        </group>
    );
};

export default Cube;
