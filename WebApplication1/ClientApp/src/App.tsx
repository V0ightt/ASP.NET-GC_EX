import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import TopBar from './components/TopBar'
import ExpensesTable from './components/ExpensesTable'
import { login, getToken } from './services/auth'
import RegisterPage from './pages/Register'
import { useState } from 'react'
import { toast } from 'react-toastify'

function LoginPage() {
    const [creds, setCreds] = useState({ email: '', password: '' })
    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        try { await login(creds); toast.success('Welcome!'); window.location.href = '/expenses' }
        catch { toast.error('Wrong email or password') }
    }

    return (
        <Container className="mt-4" style={{ maxWidth: 400 }}>
            <h3>Sign in</h3>
            <form onSubmit={submit}>
                <input className="form-control mb-2" type="email" placeholder="Email" required
                    value={creds.email} onChange={e => setCreds({ ...creds, email: e.target.value })} />
                <input className="form-control mb-3" type="password" placeholder="Password" required
                    value={creds.password} onChange={e => setCreds({ ...creds, password: e.target.value })} />
                <button className="btn btn-primary w-100">Login</button>
            </form>
        </Container>
    )
}

function RequireAuth({ children }: { children: JSX.Element }) {
    return getToken() ? children : <Navigate to="/login" replace />
}

export default function App() {
    return (
        <>
            <TopBar />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/expenses" />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    <Route path="/expenses" element={
                        <RequireAuth>
                            <Container className="mt-4"><ExpensesTable /></Container>
                        </RequireAuth>
                    } />
                    <Route path="*" element={<Navigate to="/expenses" />} />
                </Routes>
            </BrowserRouter>
        </>
    )
}
