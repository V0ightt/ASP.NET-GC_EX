import { useState } from 'react'
import { Container, Form, Button } from 'react-bootstrap'
import { register } from '../services/auth'
import { toast } from 'react-toastify'

export default function RegisterPage() {
    const [creds, setCreds] = useState({ email: '', password: '', confirm: '' })
    const [loading, setLoading] = useState(false)

    const submit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (creds.password !== creds.confirm) {
            toast.error('Passwords do not match'); return
        }
        setLoading(true)
        try {
            await register({ email: creds.email, password: creds.password })
            toast.success('Registered!'); window.location.href = '/expenses'
        } catch (err: any) {
            toast.error(err.message || 'Registration failed')
        } finally { setLoading(false) }
    }

    return (
        <Container className="mt-4" style={{ maxWidth: 400 }}>
            <h3>Create account</h3>
            <Form onSubmit={submit}>
                <Form.Control className="mb-2" type="email" placeholder="Email" required
                    value={creds.email} onChange={e => setCreds({ ...creds, email: e.target.value })} />
                <Form.Control className="mb-2" type="password" placeholder="Password" required
                    value={creds.password} onChange={e => setCreds({ ...creds, password: e.target.value })} />
                <Form.Control className="mb-3" type="password" placeholder="Confirm password" required
                    value={creds.confirm} onChange={e => setCreds({ ...creds, confirm: e.target.value })} />
                <Button type="submit" disabled={loading}>Register</Button>
            </Form>
        </Container>
    )
}
