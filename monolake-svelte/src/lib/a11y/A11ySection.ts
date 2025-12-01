import { getContext } from 'svelte';

const key = Symbol('A11ySection');

interface A11ySectionContext {
    current: HTMLElement | null;
}

export const useA11ySectionContext = (): A11ySectionContext => {
    return getContext<A11ySectionContext>(key) || { current: null };
};
