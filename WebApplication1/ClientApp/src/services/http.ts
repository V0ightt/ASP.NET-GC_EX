// -----------------------------------------------------------------------------
// Thin fetch wrapper that automatically attaches the Bearer token
// and returns an axios-like { data } object.
//
// IMPORTANT: 204 / 205 responses have *no* body, so we must NOT call res.json().
// -----------------------------------------------------------------------------

import { getToken, logout } from './auth'
import { toast } from 'react-toastify'

type Json = Record<string, unknown> | unknown[]

/* ---------- helpers -------------------------------------------------------- */

const baseHeaders = () => ({
    Authorization: `Bearer ${getToken() || ''}`
})

const asSuccess = <T>(data: T): { data: T } => ({ data })

const handleResponse = async <T>(res: Response): Promise<{ data: T }> => {
    /* 1??   Authentication failure */
    if (res.status === 401) {
        toast.error('Session expired')
        logout()
        window.location.href = '/login'
        throw new Error('Unauthorized')
    }

    /* 2??   Any other non-2xx status */
    if (!res.ok) {
        const detail = await res.text()
        throw new Error(detail || res.statusText)
    }

    /* 3??   204 / 205 or empty body -> succeed with undefined */
    if (res.status === 204 || res.status === 205 ||
        !res.headers.get('content-type')) {
        // @ts-expect-error: the caller ignores data for void endpoints
        return asSuccess(undefined)
    }

    /* 4??   Normal success with JSON body */
    return asSuccess(await res.json() as T)
}

/* ---------- public API ----------------------------------------------------- */

const http = {
    get: async <T>(url: string) =>
        handleResponse<T>(await fetch(url, { headers: baseHeaders() })),

    post: async <T>(url: string, body: Json) =>
        handleResponse<T>(
            await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', ...baseHeaders() },
                body: JSON.stringify(body)
            })
        ),

    put: async <T>(url: string, body: Json) =>
        handleResponse<T>(
            await fetch(url, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', ...baseHeaders() },
                body: JSON.stringify(body)
            })
        ),

    delete: async (url: string) =>
        handleResponse<void>(
            await fetch(url, { method: 'DELETE', headers: baseHeaders() })
        )
}

export default http
