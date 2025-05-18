// -----------------------------------------------------------------------------
// Very small auth helper: login -> store JWT -> read / clear
// -----------------------------------------------------------------------------

export interface LoginDto {
    email: string
    password: string
}

const TOKEN_KEY = 'em_token'

export const login = async (dto: LoginDto) => {
    const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
    })

    if (!res.ok) throw new Error('Bad credentials')

    const data = await res.json() // { access_token, expires }
    localStorage.setItem(TOKEN_KEY, data.access_token)
}

export const register = async (dto: LoginDto) => {
    const res = await fetch('/api/v1/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dto)
    })

    if (!res.ok) {
        const msg = await res.text()
        throw new Error(msg)
    }

    const data = await res.json()
    localStorage.setItem(TOKEN_KEY, data.access_token)
}

export const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    window.location.href = '/login'
}
export const getToken = () => localStorage.getItem(TOKEN_KEY)

