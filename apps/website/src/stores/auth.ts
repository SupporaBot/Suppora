import router from "@/router";
import { API_BaseUrl, ApiRequest } from "@/utils/api";
import { asyncState } from "@/utils/asyncState";
import { supabase } from "@/utils/supabase";
import type { Session, User } from "@supabase/supabase-js";
import { type API_SelfUserIdentity } from "@suppora/shared"
import { HttpStatusCode } from "axios";
import { DateTime } from "luxon";
import useNotifier from "./notifier";



export const useAuthStore = defineStore('auth', () => {

    // Auth States:
    const authReady = ref<boolean>(false);
    const signedIn = ref<boolean>(false);
    const user = ref<User | null>(null);
    const session = ref<Session | null>(null);

    // Identity & Fetch Method:
    const identity = ref<API_SelfUserIdentity | undefined>(undefined)
    async function getSelfIdentity(forceAPI?: boolean) {
        // Mark Auth Unready:
        authReady.value = false
        // Method Vars:
        const notifier = useNotifier()
        const identityFetchCooldownSecs = 120
        try {
            // Confirm Session:
            if (!session.value) throw new Error(`[Self Identity Error]: Cannot fetch identity without valid session!`, { cause: session })
            // Check for Cooldown:
            const lastGet = identity.value?._fetched_at
                ? DateTime.fromISO(identity.value._fetched_at)
                : undefined
            if (lastGet?.isValid) {
                const secsElapsed = (DateTime.utc().diff(lastGet, 'seconds')?.seconds ?? 0)
                if (secsElapsed < identityFetchCooldownSecs) {
                    const secsRemaining = Math.max(0, Math.ceil(identityFetchCooldownSecs - secsElapsed))
                    // Return Cooldown Result:
                    authReady.value = true
                    return {
                        success: false,
                        ctx: {
                            issue: 'COOLDOWN - Recently Fetched',
                            secondsRemaining: secsRemaining
                        }
                    } as const
                }
            }
            // Fetch Fresh Identity:
            const reqPath = `/identity/users/@me${forceAPI ? '?force=true' : ''}`;
            const { success, status, data, error } = await ApiRequest<API_SelfUserIdentity>({ url: reqPath });
            if (status == HttpStatusCode.Unauthorized || status == HttpStatusCode.Forbidden) {
                console.warn(`[↗️ Self Identity]: Failed - Must Re-Authenticate!`)
                signIn(useRoute().fullPath)
                // Return Forbidden Result:
                authReady.value = true
                return {
                    success: false,
                    ctx: {
                        issue: 'API - Unauthorized/Forbidden',
                        status,
                        error
                    }
                } as const

            }
            if (!success || error) throw new Error(`[Self Identity Error]: Identity API response returned unsuccessful!`, { cause: error, })

            // Set Fresh Identity:
            identity.value = data



            // Return Success:
            console.info('[👤 Self Identity]: FETCHED', { data })
            authReady.value = true
            return {
                success: true,
                ctx: {
                    identity: identity.value
                }
            } as const
        } catch (err) {
            // Log & Return Error:
            console.error('[Identity Fetch]: ERROR', err)
            if (import.meta.env.PROD) signOut()
            notifier.send({
                level: 'error',
                header: 'Identity Failure',
                content: h('span', { class: 'text-xs p-1' }, `We were unable to fetch your account identity and had to sign you out of your account! Try signing back in, if the issue continues please contact Support!`),
                duration: false,
                icon: 'mingcute:user-x-fill'
            })
            return {
                success: false,
                ctx: {
                    issue: 'CAUGHT ERROR',
                    error: err
                }
            } as const
        }

    }


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


    // Util - Reset Store
    function reset() {
        authReady.value = true;
        signedIn.value = false;
        user.value = null;
        session.value = null;
        // Self Identity
        identity.value = undefined as any;
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
        /**The currently signed in auth `identity` *(if any)**/
        identity,
        /****`Method`** - Used for users to refresh their account {@linkcode identity}.
         * @note This adjusts {@linkcode authReady} as its fetching & completed! */
        getSelfIdentity,
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
            if (session) await s.getSelfIdentity() // await s.identity?.execute()
            s.authReady = true;
            // Check for Redirect after Auth:
            const redirectTo = s?.useRedirectAfterAuth.get()
            if (redirectTo) {
                router.push(redirectTo)
                s.useRedirectAfterAuth.clear()
            }

        } else if (event == 'TOKEN_REFRESHED' || event == 'USER_UPDATED') {
            // Refetch SELF Identity - Update Store:
            if (session) await s.getSelfIdentity()


        } else if (event == 'SIGNED_OUT' || !s || !s.user) {
            // User Signed Out - Clear/Reset Auth Store:
            if (debugAuthEvents) console.log('NO Auth User detected, clearing store...');
            s.reset();
        }

    })
}