import * as THREE from 'three';
import { Canvas, useFrame } from '@react-three/fiber';
import { useRef } from 'react';

const Box = () => {
    const boxRef = useRef<THREE.Mesh>(null!);

    useFrame(() => {
        boxRef.current.rotation.x += 0.005;
        boxRef.current.rotation.y += 0.01;
    });

    return (
        <mesh ref={boxRef}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="orange" />
        </mesh>
    );
};

const ThreeScene = () => {
    return (
        <Canvas>
            <ambientLight intensity={0.1} />
            <directionalLight color="red" position={[0, 0, 5]} />
            <Box />
        </Canvas>
    );
};

function App() {
    return (
        <div style={{ height: '100vh' }}>
            <ThreeScene />
        </div>
    );
}

export default App;
