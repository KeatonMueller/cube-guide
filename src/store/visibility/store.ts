import { create } from 'zustand';

export type Actions = {
    setIsVisible: (visibility: boolean) => void;
};

export type VisibilityState = {
    actions: Actions;
    isVisible: boolean;
};

const initialState: Omit<VisibilityState, 'actions'> = {
    isVisible: true,
};

const useVisibilityStore = create<VisibilityState>(set => ({
    ...initialState,
    actions: {
        setIsVisible: (isVisible: boolean) => set(_ => ({ isVisible })),
    },
}));

export const useIsVisible = () => useVisibilityStore(state => state.isVisible);
export const useVisibilityActions = () => useVisibilityStore(state => state.actions);
