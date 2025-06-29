import * as THREE from 'three';
import './styles/styles.css';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import { roundedBoxGeometry } from './cube/geometries/roundedBoxGeometry';
import Cube from './cube/Cube';
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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

const Controls = () => {
    const controlsRef = useRef<OrbitControls>(null!);
    const {
        camera,
        gl: { domElement },
    } = useThree();

    useFrame(() => {
        controlsRef.current.update();
    });

    useEffect(() => {
        camera.position.x = 4;
        camera.position.y = 3;
        camera.position.z = 6;

        const onPointerDown = (e: MouseEvent) => {
            console.log('pointer down!', e);
        };
        const onPointerUp = (e: MouseEvent) => {
            console.log('pointer up!', e);
        };
        document.addEventListener('pointerdown', onPointerDown);
        document.addEventListener('pointerup', onPointerUp);

        return () => {
            document.removeEventListener('pointerdown', onPointerDown);
            document.removeEventListener('pointerup', onPointerUp);
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
    return (
        <Canvas>
            <ambientLight intensity={1} />
            {/* <ambientLight intensity={0.1} /> */}
            {/* <directionalLight color="red" position={[0, 0, 5]} /> */}
            <axesHelper args={[10]} />
            <Controls />
            {/* <Box /> */}
            <Cube />
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
