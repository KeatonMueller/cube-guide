import * as THREE from 'three';
import './styles/styles.css';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, type RefObject } from 'react';
import { roundedBoxGeometry } from './cube/geometries/roundedBoxGeometry';
import Cube from './cube/Cube';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useIsVisible, useConfigActions } from './store/config/store';

const Box = () => {
    const boxRef = useRef<THREE.Mesh>(null!);

    useFrame(() => {
        boxRef.current.rotation.x += 0.005;
        boxRef.current.rotation.y += 0.01;
    });

    return (
        <mesh geometry={roundedBoxGeometry} ref={boxRef}>
            <meshStandardMaterial color="orange" />
        </mesh>
    );
};

interface ControlsProps {
    controlsRef: RefObject<OrbitControls>;
}

const Controls = ({ controlsRef }: ControlsProps) => {
    const {
        camera,
        gl: { domElement },
    } = useThree();
    const isVisible = useIsVisible();
    const { setIsVisible } = useConfigActions();

    useFrame(() => {
        if (!isVisible) return;
        controlsRef.current.update();
        // console.log(camera.rotation);
    });

    useEffect(() => {
        camera.position.x = 4;
        camera.position.y = 3;
        camera.position.z = 6;

        // listen for visibility updates
        const onVisibilityChange = () => {
            setIsVisible(document.visibilityState === 'visible');
        };
        document.addEventListener('visibilitychange', onVisibilityChange);

        // pointer events
        const onPointerDown = (e: MouseEvent) => {
            // console.log('pointer down!', e);
        };
        const onPointerUp = (e: MouseEvent) => {
            // console.log('pointer up!', e);
            controlsRef.current.enabled = true;
        };
        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('pointerup', onPointerUp);

        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('pointerup', onPointerUp);
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, []);

    return (
        <orbitControls
            ref={controlsRef}
            args={[camera, domElement]}
            enableDamping={true}
            enableZoom={false}
            enablePan={false}
        />
    );
};

const ThreeScene = () => {
    const controlsRef = useRef<OrbitControls>(null!);

    return (
        <Canvas>
            <ambientLight intensity={1} />
            {/* <ambientLight intensity={0.1} /> */}
            {/* <directionalLight color="red" position={[0, 0, 5]} /> */}
            {/* <axesHelper args={[10]} /> */}
            <Controls controlsRef={controlsRef} />
            {/* <Box /> */}
            <Cube controlsRef={controlsRef} />
        </Canvas>
    );
};

const App = () => {
    return (
        <div style={{ height: '100vh' }}>
            <ThreeScene />
        </div>
    );
};

export default App;
