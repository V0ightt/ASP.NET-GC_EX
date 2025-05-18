// -----------------------------------------------------------------------------
// Convenience wrappers around each /api/v1/expenses endpoint
// -----------------------------------------------------------------------------

import http from './http'
import type { Expense } from '../types'

export const getExpenses = () =>
    http.get<Expense[]>('/api/v1/expenses').then(r => r.data)

export const addExpense = (e: Omit<Expense, 'id'>) =>
    http.post<Expense>('/api/v1/expenses', e).then(r => r.data)

export const updateExpense = (e: Expense) =>
    http.put(`/api/v1/expenses/${e.id}`, e)

export const deleteExpense = (id: number) =>
    http.delete(`/api/v1/expenses/${id}`)
