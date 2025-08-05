import type { DirectedAxis } from '../constants';

export const directedAxisEqual = (a: DirectedAxis, b: DirectedAxis): boolean => {
    return a.axisLabel === b.axisLabel && a.direction === b.direction;
};
