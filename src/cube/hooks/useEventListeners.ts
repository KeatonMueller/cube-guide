import * as THREE from 'three';
import { useEffect, type RefObject } from 'react';
import type { OrbitControls } from 'three/examples/jsm/Addons.js';
import { usePointerLocation, usePointerPosition, usePointerSelection, useTouchActions } from '../../store/touch/store';
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

    const pointerLocation = usePointerLocation();
    const pointerSelection = usePointerSelection();
    const pointerPosition = usePointerPosition();
    const planes = usePlanes();
    const { queueMove } = useMovesActions();
    const { setIsVisible } = useConfigActions();
    const { setPointerLocation, setPointerSelection, setPointerPosition } = useTouchActions();

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
            if (e.buttons === 4) {
                console.log(e.clientX, e.clientY);
                console.log(camera.rotation);
            }
        };
        // pointerDown events to initiate the click and drag are initiated on the Cubie.tsx's mesh directly
        const onPointerUp = (e: MouseEvent) => {
            // console.log('pointer up!', e);
            controlsRef.current.enabled = true;
            setPointerLocation(null);
            setPointerSelection(null);
            setPointerPosition(null);
        };
        const onPointerMove = (e: MouseEvent) => {
            // console.log('pointer move', e);
            if (pointerLocation && pointerSelection && pointerPosition) {
                const currLocation = new THREE.Vector2(e.clientX, e.clientY);

                const distance = pointerLocation.distanceTo(currLocation);
                if (distance < 75) return;

                const move = getPointerMove(
                    pointerPosition,
                    pointerSelection,
                    pointerLocation,
                    currLocation,
                    camera,
                    domElement,
                    raycaster,
                    e,
                    planes
                );

                if (move) {
                    console.log('move', move);
                    queueMove(move);
                    setPointerLocation(null);
                    setPointerSelection(null);
                }
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
