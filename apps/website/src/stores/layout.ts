import { defineStore } from "pinia";


export const useLayoutStore = defineStore('nav', () => {

    // Navigation / Side Menu Options:
    const useNav = () => {
        const visible = ref(false);
        function open() {
            visible.value = true;
            scrollLock.value = true;
        }
        function close() {
            visible.value = false;
            scrollLock.value = false;
        }
        return { visible, open, close }
    }
    const nav = useNav();

    // Application Wide - Scroll Lock:
    const scrollLock = useScrollLock(window)

    // Application Color Mode - Config / Value:
    const colorMode = () => (useColorMode({
        storageKey: 'suppora-color-scheme',
        initialValue: 'dark',
        attribute: 'data-theme'
    }))

    // Reactive Header Height:
    const appHeader = {
        currentHeight: ref(0),
        updateHeight: (h: number) => appHeader.currentHeight.value = h
    }

    // + Return States & Methods:
    return {
        /** `App Navigation` states and methods. */
        nav,
        /** Main controller and value for current selected site theme. */
        colorMode,
        /** Reactive App Header Values */
        appHeader
    }
})


/** External `URLs` commonly used within Suppora ecosystem */
export const URLS = {
    website: "https://suppora.app",
    documentation: "https://docs.suppora.app",
    status: "https://status.suppora.app",
    invite: "https://invite.suppora.app",
    discord: {
        support: "https://discord.gg/INVITE_CODE",
        general: "https://discord.gg/INVITE_CODE"
    }
}