// -----------------------------------------------------------------------------
// Global DTOs / view-models shared across the SPA
// -----------------------------------------------------------------------------

/** Matches the Expense entity returned by /api/v1/expenses */
export interface Expense {
    id: number
    value: number
    property?: string
}
