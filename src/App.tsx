import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import { roundedBoxGeometry } from './cube/geometries/roundedBoxGeometry';
import Cube from './cube/Cube';

const Box = () => {
    const boxRef = useRef<THREE.Mesh>(null!);

    useFrame(() => {
        boxRef.current.rotation.z += 0.005;
        // boxRef.current.rotation.y += 0.01;
    });

    return (
        <mesh geometry={roundedBoxGeometry} ref={boxRef}>
            <meshStandardMaterial color="orange" />
        </mesh>
    );
};

const Controls = () => {
    const {
        camera,
        gl: { domElement },
    } = useThree();

    return <orbitControls args={[camera, domElement]} />;
};

const ThreeScene = () => {
    return (
        <Canvas>
            <ambientLight intensity={0.1} />
            <directionalLight color="red" position={[0, 0, 5]} />
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
