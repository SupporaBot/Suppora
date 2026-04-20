import router from "@/router";
import { API_BaseUrl, ApiRequest } from "@/utils/api";
import { supabase } from "@/utils/supabase";
import type { Session, User } from "@supabase/supabase-js";
import { type API_SelfUserIdentity } from "@suppora/shared"
import { HttpStatusCode } from "axios";
import { DateTime } from "luxon";



export const useAuthStore = defineStore('auth', () => {

    // Auth States:
    const authReady = ref<boolean>(false);
    const signedIn = ref<boolean>(false);
    const user = ref<User | null>(null);
    const session = ref<Session | null>(null);
    // const identity = ref<API_SelfUserIdentity & { _next_fetch_allowed_at: DateTime } | null>(null);

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

    // Class/Utils - For Redirection after Sign In:
    const redirectStoreKey = 'suppora_auth_redirect' as const
    const useRedirectAfterAuth = {
        get: () => localStorage.getItem(redirectStoreKey),
        set: (v: string) => localStorage.setItem(redirectStoreKey, v),
        clear: () => localStorage.removeItem(redirectStoreKey)

    }

    // Method - Redirect to API Sign In:
    async function signIn(redirectPath?: string) {
        if (redirectPath) useRedirectAfterAuth.set(redirectPath)
        return window.location.assign(API_BaseUrl + '/auth/sign-in')
    }

    // Method - Sign Out via Supabase:
    async function signOut() {
        await supabase.auth.signOut()
        location.assign('/')
    }

    const identity = (() => useAsyncState(
        fetchSelfIdentity,
        undefined,
        {
            immediate: false
        }
    ))()



    // Method - Fetch Self Identity:
    const selfIdentityFetchMinCooldownMins = 2.5
    async function fetchSelfIdentity(forceApi?: boolean) {
        // Confirm Session:
        if (!session.value) return Promise.reject(`(!) Cannot fetch identity w/o a valid session!`)
        // Check Cooldown:
        const prevLastFetchedAt = DateTime.fromISO(String(identity.state.value?._fetched_at), { zone: 'utc' })
        const nextFetchAllowedAt = prevLastFetchedAt?.plus({ minutes: selfIdentityFetchMinCooldownMins })
        if (nextFetchAllowedAt > DateTime.utc()) {
            console.warn(`[Self Identity]: COOLDOWN - Too many requests! You need to wait at least ${nextFetchAllowedAt?.diffNow('second')?.seconds ?? '?'} seconds before you fetch your identity again!`)
            return Promise.reject('COOLDOWN')
        }


        // Make API Request:
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
            const lastFetchedAt = DateTime.fromISO(String(data?._fetched_at), { zone: 'utc' })
            const r = {
                ...data,
                _next_fetch_allowed_at: lastFetchedAt?.plus({ minutes: selfIdentityFetchMinCooldownMins })
            }
            return r
        }
    }

    // Util - Reset Store
    function reset() {
        authReady.value = true;
        signedIn.value = false;
        user.value = null;
        session.value = null;
        // Self Identity
        identity.state = undefined as any;
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
        /** Class/Utils - For Redirection after successful auth {@linkcode signIn()} */
        useRedirectAfterAuth,
        /****`Method`/`Redirect`** - Used for users to sign into their accounts. */
        signIn,
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
            if (session) await s.identity?.execute()
            s.authReady = true;
            // Check for Redirect after Auth:
            const redirectTo = s?.useRedirectAfterAuth.get()
            if (redirectTo) {
                router.push(redirectTo)
                s.useRedirectAfterAuth.clear()
            }

        } else if (event == 'TOKEN_REFRESHED' || event == 'USER_UPDATED') {
            // Refetch SELF Identity - Update Store:
            if (session) await s.identity?.execute()

        } else if (event == 'SIGNED_OUT' || !s || !s.user) {
            // User Signed Out - Clear/Reset Auth Store:
            if (debugAuthEvents) console.log('NO Auth User detected, clearing store...');
            s.reset();
        }

    })
}