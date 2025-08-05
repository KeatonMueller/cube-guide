import './styles/styles.css';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef, type RefObject } from 'react';
import Cube from './cube/Cube';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useIsVisible } from './store/config/store';

interface ControlsProps {
    controlsRef: RefObject<OrbitControls>;
}

const Controls = ({ controlsRef }: ControlsProps) => {
    const {
        camera,
        gl: { domElement },
    } = useThree();
    const isVisible = useIsVisible();

    useFrame(() => {
        if (!isVisible) return;
        controlsRef.current.update();
        // console.log(camera.rotation);
    });

    useEffect(() => {
        camera.position.x = 4;
        camera.position.y = 3;
        camera.position.z = 6;
    }, []);

    return (
        <orbitControls
            ref={controlsRef}
            args={[camera, domElement]}
            enableDamping={true}
            enableZoom={true}
            enablePan={false}
            // for some reason, our use of polygonOffset on the sticker and cubie materials to
            // prevent z-fighting issues doesn't work when the orbit controls are positioned directly
            // above and directly below the cube
            // as a hacky solution, prevent the camera from reaching those extremes since this isn't
            // really noticeable to the user
            minPolarAngle={0.01}
            maxPolarAngle={Math.PI - 0.01}
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
            <axesHelper args={[10]} />
            <Controls controlsRef={controlsRef} />
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
