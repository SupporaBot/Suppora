import { DateTime } from "luxon";
import { ApiRequest } from "./api";

type StateOptions<T> = {
    /** The default/initial value of state before `get()` is called 
     * @type- {@linkcode T} 
     * @default- `undefined` */
    defaultValue?: T
    /** Throw the error on promise failure? 
     * @default- `false` */
    throwError?: true
    /** The minimum amount of seconds to wait in between each call to `get()`  */
    cooldown?: number
    /** Weather or not to throw an error if `get()` was called during cooldown 
     * @default- `false`
     * @when_false Will NOT throw/log on cooldown and just return current state
     * @when_true Will throw/log on cooldown regardless of `throwError` option, returning no state */
    throwCooldown?: true,

    /** Optional transform function to use on response data. */
    transformData?: (data: any) => T | unknown
}


/** Custom Async State Error - Class / Constructor */
class CooldownError extends Error {

    code = 'COOLDOWN_ERROR' as const
    name: string
    cooldown: true
    last_fetched_at: string
    remaining_seconds: number

    constructor(lastGetDate: DateTime, cooldownSecs: number) {
        const secsFromLastGet = DateTime.utc()
            .diff(lastGetDate, 'seconds').seconds

        super(`You tried to \`get()\` this resource too quickly!`)
        this.name = `[CooldownError]`
        this.code = 'COOLDOWN_ERROR'
        this.cooldown = true
        this.last_fetched_at = lastGetDate.toISO()!
        this.remaining_seconds = Math.max(0, (cooldownSecs - secsFromLastGet))

        // Assign Object Prototype:
        Object.setPrototypeOf(this, CooldownError.prototype)
    }

    toJSON() {
        return { CooldownError: this }
    }
}

export function asyncState<T>(
    /** The promise to manage state for */
    promise: () => Promise<T>,  //  () => Promise<T>,
    /** Optional method/state config */
    opts?: StateOptions<T>
) {

    // State - Refed value:
    const state = ref(opts?.defaultValue)

    // State - Is loading/fetching:
    const loading = ref(false)

    // State - Has ready data/provided default:
    const ready = ref(opts?.defaultValue ? true : false)

    // State - Various metadata related to state:
    const meta = reactive({
        /** The amount of times this state has been fetched */
        count: 0,
        last_fetched_at: <DateTime | undefined>(undefined),
        cooldown_secs_remaining: () => {
            const lastGet = meta.last_fetched_at
            if (!lastGet || !opts?.cooldown) return 0;
            const difSecs = DateTime.utc().diff(lastGet, 'second')?.seconds
            return Math.max(0, Math.ceil(opts?.cooldown - difSecs))
        }
    })

    // Method - Fetch fresh value/state:
    const get = async () => {
        try {

            // Check Cooldown:
            if (opts?.cooldown) {
                const lastGet = meta.last_fetched_at
                if (lastGet) {
                    const secsFromLastGet = DateTime.utc().diff(lastGet, 'second')?.seconds
                    if (secsFromLastGet < opts.cooldown) {
                        // Called during cooldown:
                        if (opts?.throwCooldown)
                            throw new CooldownError(lastGet, opts.cooldown)
                        else return // "no throw" - cooldown
                    }
                }
            }

            // Fetch data:
            loading.value = true
            let res = await promise()

            if (opts?.transformData) {
                res = await opts.transformData(res) as Awaited<T>
            }

            // Update state:
            meta.count++
            meta.last_fetched_at = DateTime.utc()
            state.value = res
            ready.value = true

        } catch (error) {
            // Fetch failed:
            if (error instanceof CooldownError && opts?.throwCooldown) {
                return console.error(error.name, error.message, { error })
            }
            if (opts?.throwError) {
                return console.error(`[AsyncState]:`, error, { error })
            }

        } finally {
            // Fetch completed:
            loading.value = false
        }
    }

    // Method - Resets state(s):
    const reset = () => {
        state.value = opts?.defaultValue || undefined;
        loading.value = false;
        ready.value = false;
        meta.count = 0
        meta.last_fetched_at = undefined
    }



    // Return State & Methods:
    return {
        /** Executes the getter promise method and assigns result as value (`this`.{@linkcode state}).*/
        get,
        /** Resets the {@linkcode asyncState} completly, resetting to defaults.
         * @uses- `defaultValue` from {@linkcode asyncStateOptions} (if provided) */
        reset,
        /** The current value of this state */
        state,
        /** `Boolean` representing weather this state is currently loading / fetching. */
        loading,
        /** `Boolean` representing weather this state is ready / has data in state. */
        ready,
        /** {@linkcode meta} object representing various aspects of the fetch state */
        meta
    }

}


export type asyncState_Options<T> = StateOptions<T>
export type asyncState_Error = CooldownError