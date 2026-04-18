import { API_BaseUrl, ApiRequest } from "@/utils/api";
import { supabase } from "@/utils/supabase";
import type { Session, User } from "@supabase/supabase-js";
import { type API_SelfUserIdentity } from "@suppora/shared"
import { HttpStatusCode } from "axios";



export const useAuthStore = defineStore('auth', () => {

    // Auth States:
    const authReady = ref<boolean>(false);
    const signedIn = ref<boolean>(false);
    const user = ref<User | null>(null);
    const session = ref<Session | null>(null);
    const identity = ref<API_SelfUserIdentity | null>(null);

    // Util - Waits for Auth to be ready */
    async function waitForAuthReady(timeoutMs = 10_000) {
        type AuthReadyResult = {
            success: boolean,
            details: string
        }
        return Promise.race([
            new Promise<AuthReadyResult>((r) => {
                setTimeout(() => {
                    r({
                        success: false,
                        details: `TIMED OUT - Auth NOT Ready (Timed out after ${timeoutMs} ms)`
                    })
                }, timeoutMs);
            }),
            new Promise<AuthReadyResult>((r) => {
                if (authReady.value == true) r({
                    success: true,
                    details: 'ALREADY READY'
                })
                watch(authReady, (isReady) => {
                    if (isReady) {
                        r({
                            success: true,
                            details: 'SUCCESS - Auth Ready'
                        })
                    }
                }, { once: true })
            })
        ])
    };

    // Method - Redirect to API Sign In:
    async function signIn() {
        return window.location.assign(API_BaseUrl + '/auth/sign-in')
    }

    // Method - Sign Out via Supabase:
    async function signOut() {
        await supabase.auth.signOut()
        location.assign('/')
    }

    // Method - Fetch Self Identity:
    async function fetchSelfIdentity(forceApi?: boolean) {
        if (!session.value) return console.error(`(!) Cannot fetch identity w/o a valid session!`)
        const apiPath = forceApi ? '/identity/users/@me?force=true' : '/identity/users/@me';
        const { data, error, status, response } = await ApiRequest<API_SelfUserIdentity>({ method: 'GET', url: apiPath })
        // If Redirection - (Re-Authenticate)
        if (status == HttpStatusCode.Unauthorized || status == HttpStatusCode.Forbidden) {
            const location = response?.headers?.['Location']
            console.warn(`[↗️ Self Identity]: Failed - Must Re-Authenticate - REDIRECTION!`, { redirect: location })
            if (location) location.assign(location)
        }
        if (error || !data) {
            console.warn('[❌ Self Identity]: API FAIL', { data, error })
        } else {
            console.info('[👤 Self Identity]: FETCHED', { data })
            identity.value = data
        }
    }

    // Util - Reset Store
    function reset() {
        authReady.value = true;
        signedIn.value = false;
        user.value = null;
        session.value = null;
        identity.value = null;
    };


    // + Return States & Methods:
    return {
        /**`Boolean` representing if the {@linkcode useAuthStore Auth Store} is ready for use*/
        authReady,
        /**`Boolean` representing if an auth {@linkcode User} is currently signed in*/
        signedIn,
        /**The currently signed in auth {@linkcode User} *(if any)**/
        user,
        /**The currently signed in auth {@linkcode Session This} *(if any)**/
        session,
        /**The currently signed in auth `identify` *(if any)**/
        identity,
        /****`Method`/`Redirect`** - Used for users to sign into their accounts. */
        signIn,
        /****`Method`** - Used for users to fetch their own SELF identity. */
        fetchSelfIdentity,
        /****`Method`** - Used for users to sign out of their accounts. */
        signOut,
        /****`Util`** - Waits for Auth Store to be ready */
        waitForAuthReady,
        /****`Util`** - Resets & Clears the {@linkcode useAuthStore Auth Store} State */
        reset
    }
})


export const initializeAuthStateWatcher = () => {
    const s = useAuthStore();
    const debugAuthEvents = true

    supabase.auth.onAuthStateChange(async (event, session) => {
        // Debug (if enabled):
        if (debugAuthEvents) console.info(`[Auth 👤] EVENT - ${event}`, { user: session?.user });

        // Update Auth State(s):
        s.signedIn = session ? true : false;
        s.session = session ? session : null;
        s.user = session?.user ? session.user : null;

        // For Specific Event Type:
        if (event == 'INITIAL_SESSION') {
            // Mark auth store as ready - Fetch Self Identity:
            if (session) await s.fetchSelfIdentity();
            s.authReady = true;

        } else if (event == 'TOKEN_REFRESHED' || event == 'USER_UPDATED') {
            // Refetch SELF Identity - Update Store:
            if (session) await s.fetchSelfIdentity();

        } else if (event == 'SIGNED_OUT' || !s || !s.user) {
            // User Signed Out - Clear/Reset Auth Store:
            if (debugAuthEvents) console.log('NO Auth User detected, clearing store...');
            s.reset();
        }

    })
}