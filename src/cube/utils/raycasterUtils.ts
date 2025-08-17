import type { Camera, ThreeEvent } from '@react-three/fiber';
import * as THREE from 'three';

export const updateRaycaster = (
    e: MouseEvent | ThreeEvent<PointerEvent>,
    canvas: HTMLCanvasElement,
    camera: Camera,
    raycaster: THREE.Raycaster
): void => {
    const pointerCoords = new THREE.Vector2(
        (e.clientX / canvas.clientWidth) * 2 - 1,
        -(e.clientY / canvas.clientHeight) * 2 + 1
    );
    raycaster.setFromCamera(pointerCoords, camera);
};
