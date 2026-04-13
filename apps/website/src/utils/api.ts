import { useAuthStore } from "@/stores/auth";
import type { APIResponseValue } from "@suppora/shared";
import axios, { AxiosError, type AxiosRequestConfig, type AxiosResponse, type Method } from "axios";

const useDevelopmentApiHost = false

export const API_BaseUrl = useDevelopmentApiHost
    ? 'http://localhost:3000/api/v1'
    : import.meta.env.VITE_DIRECT_API_URL ?? 'https://api.suppora'

export const API_AxiosInstance = axios.create({
    baseURL: API_BaseUrl,
    validateStatus(status) { return status <= 299 },
    timeout: 10_000
})

// Interceptor - ADD Auth Token Header:
API_AxiosInstance.interceptors.request.use((config) => {
    const authStore = useAuthStore();
    const accessToken = authStore.session?.access_token
    if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`
    }
    return config
})

API_AxiosInstance.interceptors.response.use(
    undefined,
    (err) => {
        // On failure (NETWORK or Status >= 300)
        const ctx = err?.response?.data || err?.response || err
        console.error(`[API ERROR] - Suppora API Failure`, ctx)
        return Promise.reject(err)
    })



/** `Util`/`Method`: Internal API Request */
export async function ApiRequest<T>(req: AxiosRequestConfig) {
    try {
        if (req.method == undefined) {
            req.method = 'get'
        }
        // Make API Request
        const response = await API_AxiosInstance.request<APIResponseValue<T>>(req)
        // Return Success (If NOT Thrown)
        if (!response?.data) throw new Error(`Api response returned no data!`, { cause: { data: response } })
        if (!response?.data?.success) throw new Error(`Api response returned unsuccessful!`, { cause: { data: response } })
        return {
            success: true,
            status: response.status,
            data: response.data?.data,
            error: undefined,
            response: response
        }
    } catch (err: any) {
        // API Error - Parse & Return:
        let status = 500
        if (err instanceof AxiosError) {
            status = err?.response?.status ?? 500
        }
        return {
            success: false,
            status: status,
            data: undefined,
            error: err as AxiosError | Error,
            response: err?.response as AxiosResponse<APIResponseValue<T>> | undefined
        }
    }

}

