import { useEffect, useState } from 'react'
import { Button, Form, Table } from 'react-bootstrap'
import { toast } from 'react-toastify'
import type { Expense } from '../types'
import { getExpenses, addExpense, updateExpense, deleteExpense } from '../services/expenses'

export default function ExpensesTable() {
    const [list, setList] = useState<Expense[]>([])
    const [form, setForm] = useState<{ value: string; property: string }>({ value: '', property: '' })
    const [saving, setSaving] = useState(false)

    // load on mount
    useEffect(() => {
        getExpenses().then(setList).catch(() => toast.error('Cannot load expenses'))
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.value) return
        setSaving(true)

        const optimistic: Expense = {
            id: -Date.now(),          // temp negative id
            value: Number(form.value),
            property: form.property
        }
        setList(prev => [optimistic, ...prev])

        try {
            const saved = await addExpense({ value: optimistic.value, property: optimistic.property })
            setList(prev => prev.map(x => (x.id === optimistic.id ? saved : x)))
            toast.success('Added!')
            setForm({ value: '', property: '' })
        } catch {
            setList(prev => prev.filter(x => x.id !== optimistic.id))
            toast.error('Add failed')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id: number) => {
        const snapshot = [...list]
        setList(prev => prev.filter(x => x.id !== id))
        try {
            await deleteExpense(id)
            toast.success('Deleted')
        } catch {
            setList(snapshot)
            toast.error('Delete failed')
        }
    }

    return (
        <>
            <h2 className="mb-3">Your Expenses</h2>

            {/* Add form */}
            <Form className="d-flex align-items-end gap-2" onSubmit={handleSubmit}>
                <Form.Group controlId="value">
                    <Form.Label>Amount</Form.Label>
                    <Form.Control
                        type="number"
                        step="0.01"
                        value={form.value}
                        required
                        onChange={e => setForm(f => ({ ...f, value: e.target.value }))}
                    />
                </Form.Group>

                <Form.Group controlId="prop">
                    <Form.Label>Property</Form.Label>
                    <Form.Control
                        value={form.property}
                        onChange={e => setForm(f => ({ ...f, property: e.target.value }))}
                    />
                </Form.Group>

                <Button type="submit" disabled={saving}>Add</Button>
            </Form>

            {/* Table */}
            <Table striped bordered hover className="mt-4">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Value</th>
                        <th>Property</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {list.map((e, idx) => (
                        <tr key={e.id}>
                            <td>{idx + 1}</td>
                            <td>{e.value.toFixed(2)}</td>
                            <td>{e.property}</td>
                            <td>
                                <Button variant="danger" size="sm" onClick={() => handleDelete(e.id)}>
                                    delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    )
}
