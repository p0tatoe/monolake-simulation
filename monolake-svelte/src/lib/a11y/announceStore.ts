import { writable } from 'svelte/store';

function createAnnounceStore() {
    const { subscribe, set } = writable('');

    return {
        subscribe,
        a11yScreenReader: (msg: string) => {
            set(msg);
        }
    };
}

const announceStore = createAnnounceStore();
export default announceStore;
