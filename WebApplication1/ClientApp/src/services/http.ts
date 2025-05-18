// -----------------------------------------------------------------------------
// Thin fetch wrapper that automatically attaches the Bearer token
// and returns an axios-like `{ data }` shape.
// -----------------------------------------------------------------------------

import { getToken, logout } from './auth'
import { toast } from 'react-toastify'

type Json = Record<string, unknown> | unknown[]

const baseHeaders = () => ({
    Authorization: `Bearer ${getToken() || ''}`
})

const handleResponse = async <T>(res: Response): Promise<{ data: T }> => {
    if (res.status === 401) {
        toast.error('Session expired')
        logout()
        window.location.href = '/login'
        throw new Error('Unauthorized')
    }

    if (!res.ok) {
        const detail = await res.text()
        throw new Error(detail || res.statusText)
    }

    return { data: (await res.json()) as T }
}

const http = {
    get: async <T>(url: string) => {
        const res = await fetch(url, { headers: baseHeaders() })
        return handleResponse<T>(res)
    },

    post: async <T>(url: string, body: Json) => {
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...baseHeaders()
            },
            body: JSON.stringify(body)
        })
        return handleResponse<T>(res)
    },

    put: async <T>(url: string, body: Json) => {
        const res = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...baseHeaders()
            },
            body: JSON.stringify(body)
        })
        return handleResponse<T>(res)
    },

    delete: async (url: string) => {
        const res = await fetch(url, {
            method: 'DELETE',
            headers: baseHeaders()
        })
        await handleResponse<unknown>(res)
    }
}

export default http        // ??  default export
