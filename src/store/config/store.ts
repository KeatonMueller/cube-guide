import { create } from 'zustand';

export type Actions = {
    setIsVisible: (isVisible: boolean) => void;
};

export type ConfigState = {
    actions: Actions;
    isVisible: boolean;
};

const initialState: Omit<ConfigState, 'actions'> = {
    isVisible: true,
};

const useConfigStore = create<ConfigState>(set => ({
    ...initialState,
    actions: {
        setIsVisible: (isVisible: boolean) => set(_ => ({ isVisible })),
    },
}));

export const useConfigActions = () => useConfigStore(state => state.actions);
export const useIsVisible = () => useConfigStore(state => state.isVisible);
