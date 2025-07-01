import * as THREE from 'three';
import { useEffect, type RefObject } from 'react';
import type { OrbitControls } from 'three/examples/jsm/Addons.js';
import { usePointerLocation, useTouchActions } from '../../store/touch/store';
import { useConfigActions } from '../../store/config/store';
import { keyToMove } from '../utils/moveUtils';
import { useMovesActions } from '../../store/moves/store';
import { useThree } from '@react-three/fiber';

export const useEventListeners = (controlsRef: RefObject<OrbitControls>): void => {
    const { camera } = useThree();
    const { queueMove } = useMovesActions();

    const { setIsVisible } = useConfigActions();
    const pointerLocation = usePointerLocation();
    const { setPointerLocation, setPointerSelection } = useTouchActions();

    // event listeners that don't depend on any state and shouldn't need to be updated
    useEffect(() => {
        const abortController = new AbortController();

        // listen for visibility updates
        const onVisibilityChange = () => {
            setIsVisible(document.visibilityState === 'visible');
        };
        document.addEventListener('visibilitychange', onVisibilityChange, abortController);

        // listen for keyboard events to trigger moves
        const onKeyDown = (e: KeyboardEvent): void => {
            const move = keyToMove(e.key, camera);
            if (move) {
                queueMove(move);
            }
        };
        document.addEventListener('keydown', onKeyDown, abortController);

        return () => {
            abortController.abort();
        };
    });

    // pointer event listeners that update based on current pointer selection and location
    useEffect(() => {
        const abortController = new AbortController();

        const onPointerDown = (e: MouseEvent) => {
            // console.log('pointer down!', e);
        };
        const onPointerUp = (e: MouseEvent) => {
            // console.log('pointer up!', e);
            controlsRef.current.enabled = true;
            setPointerLocation(null);
            setPointerSelection(null);
        };
        const onPointerMove = (e: MouseEvent) => {
            // console.log('pointer move', e);
            if (pointerLocation) {
                const currLocation = new THREE.Vector2(e.clientX, e.clientY);
                const distance = pointerLocation.distanceTo(currLocation);
                console.log(distance, 'from', pointerLocation, 'to', currLocation);
            }
        };
        document.addEventListener('pointerdown', onPointerDown, abortController);
        document.addEventListener('pointerup', onPointerUp, abortController);
        document.addEventListener('pointermove', onPointerMove, abortController);

        return () => {
            abortController.abort();
        };
    }, [pointerLocation]);
};
