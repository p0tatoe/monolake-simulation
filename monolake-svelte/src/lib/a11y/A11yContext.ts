import { getContext } from 'svelte';
import type { Writable } from 'svelte/store';

export const a11yContextKey = Symbol('A11yContext');

export interface A11yContextValue {
    hover: boolean;
    focus: boolean;
    pressed: boolean;
}

export const useA11y = () => {
    return getContext<Writable<A11yContextValue>>(a11yContextKey);
};
