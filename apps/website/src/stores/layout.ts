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

    // App Wide Color Theme:
    const useColorTheme = () => {
        const mode = useColorMode({
            storageKey: 'suppora-color-scheme',
            initialValue: 'dark',
            attribute: 'data-theme',
        })
        function toggle() {
            if (mode.value == 'dark' || mode.value == 'auto') mode.value = 'light'
            else mode.value = 'dark'
        }
        return { mode, toggle }
    }
    const colorTheme = useColorTheme()

    // Site Header - State:
    const useAppHeader = () => {
        const currentHeight = ref(0)
        const rounded = ref(true)
        return {
            currentHeight,
            rounded
        }
    }
    const appHeader = useAppHeader()

    // Site Footer - State:
    const useAppFooter = () => {
        const isVisible = ref(true)
        const currentHeight = ref(0)
        const rounded = ref(true)
        return {
            isVisible,
            currentHeight,
            rounded
        }
    }
    const appFooter = useAppFooter()


    // + Return States & Methods:
    return {
        /** `App Navigation` states and methods. */
        nav,
        /** Main controller and value for current selected site theme. */
        colorTheme,
        /** Reactive App Header Values */
        appHeader,
        /** Reactive App Footer Values */
        appFooter
    }
})


/** External `URLs` commonly used within Suppora ecosystem */
export const URLS = {
    website: "https://suppora.app",
    documentation: "https://docs.suppora.app",
    status: "https://status.suppora.app",
    invite: "https://invite.suppora.app",
    discord: {
        support: "https://discord.gg/jQjWxkbgbT",
        general: "https://discord.gg/pEVXUpBzZs"
    }
}