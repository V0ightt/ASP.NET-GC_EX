import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { Container, Form, Button } from 'react-bootstrap'
import ExpensesTable from './components/ExpensesTable'
import { login, getToken } from './services/auth'
import { useState } from 'react'
import { toast } from 'react-toastify'

function Login() {
    const nav = useNavigate()
    const [creds, setCreds] = useState({ email: '', password: '' })
    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            await login(creds)
            toast.success('Welcome back!')
            nav('/expenses')
        } catch {
            toast.error('Wrong email or password')
        }
    }

    return (
        <Container className="mt-4" style={{ maxWidth: 400 }}>
            <h3>Sign in</h3>
            <Form onSubmit={submit}>
                <Form.Control
                    className="mb-2"
                    type="email"
                    placeholder="Email"
                    required
                    value={creds.email}
                    onChange={e => setCreds({ ...creds, email: e.target.value })}
                />
                <Form.Control
                    className="mb-2"
                    type="password"
                    placeholder="Password"
                    required
                    value={creds.password}
                    onChange={e => setCreds({ ...creds, password: e.target.value })}
                />
                <Button type="submit">Login</Button>
            </Form>
        </Container>
    )
}

function RequireAuth({ children }: { children: JSX.Element }) {
    return getToken() ? children : <Navigate to="/login" replace />
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/expenses" element={
                    <RequireAuth>
                        <Container className="mt-4"><ExpensesTable /></Container>
                    </RequireAuth>
                } />
                <Route path="*" element={<Navigate to="/expenses" />} />
            </Routes>
        </BrowserRouter>
    )
}
