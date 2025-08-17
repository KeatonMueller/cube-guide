import * as THREE from 'three';
import { useEffect, type RefObject } from 'react';
import type { OrbitControls } from 'three/examples/jsm/Addons.js';
import { usePointerPosition, usePointerSelection, useTouchActions } from '../../store/touch/store';
import { useConfigActions } from '../../store/config/store';
import { getPointerMove, keyToMove } from '../utils/moveUtils';
import { useMovesActions } from '../../store/moves/store';
import { useThree } from '@react-three/fiber';
import { usePlanes } from '../../store/planes/store';

export const useEventListeners = (controlsRef: RefObject<OrbitControls>, raycaster: THREE.Raycaster): void => {
    const {
        camera,
        gl: { domElement },
    } = useThree();

    const pointerSelection = usePointerSelection();
    const pointerPosition = usePointerPosition();
    const planes = usePlanes();
    const { queueMove } = useMovesActions();
    const { setIsVisible } = useConfigActions();
    const { setPointerSelection, setPointerPosition } = useTouchActions();

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
    }, []);

    // pointer event listeners that update based on current pointer selection and location
    useEffect(() => {
        const abortController = new AbortController();

        // pointerDown events to initiate the click and drag are initiated on the Cubie.tsx's mesh directly
        const onPointerUp = (_: MouseEvent) => {
            controlsRef.current.enabled = true;
            setPointerSelection(null);
            setPointerPosition(null);
        };

        const onPointerMove = (e: MouseEvent) => {
            if (pointerSelection && pointerPosition) {
                const move = getPointerMove(
                    pointerPosition,
                    pointerSelection,
                    camera,
                    domElement,
                    raycaster,
                    e,
                    planes
                );

                if (move) {
                    queueMove(move);
                    setPointerSelection(null);
                    setPointerPosition(null);
                }
            }
        };
        document.addEventListener('pointerup', onPointerUp, abortController);
        document.addEventListener('pointermove', onPointerMove, abortController);

        return () => {
            abortController.abort();
        };
    }, [pointerPosition]);
};
