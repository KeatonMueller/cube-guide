import { extend, type ThreeElement } from '@react-three/fiber';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

/**
 * Extending JSX types to recognize `<orbitControls/>`
 *
 * https://r3f.docs.pmnd.rs/tutorials/v9-migration-guide#threeelements
 */
declare module '@react-three/fiber' {
    interface ThreeElements {
        orbitControls: ThreeElement<typeof OrbitControls>;
    }
}

extend({ OrbitControls });
