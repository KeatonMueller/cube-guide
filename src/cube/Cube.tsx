import Cubie from './Cubie';
import type { Coords } from './types';

const CUBIE_COORDS: Coords[] = [];

for (let x = -1; x <= 1; x++) {
    for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
            if (x !== 0 || y !== 0 || z !== 0) CUBIE_COORDS.push({ x, y, z });
        }
    }
}

const Cube = () => {
    return (
        <group>
            {CUBIE_COORDS.map(coords => (
                <Cubie coords={coords} key={JSON.stringify(coords)} />
            ))}
        </group>
    );
};

export default Cube;
