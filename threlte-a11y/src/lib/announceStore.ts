import { writable } from 'svelte/store';

function createAnnounceStore() {
    const { subscribe, set } = writable('');

    return {
        subscribe,
        a11yScreenReader: (msg: string) => {
            set(msg);
            // Reset after a short delay to allow re-announcing the same message? 
            // The React code handles this in handleBtnClick with a timeout.
            // But the store itself just sets it.
        }
    };
}

const announceStore = createAnnounceStore();
export default announceStore;
