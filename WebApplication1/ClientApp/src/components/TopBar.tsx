import { Navbar, Container, Nav } from 'react-bootstrap'
import { getToken, logout } from '../services/auth'

export default function TopBar() {
    const hasToken = !!getToken()

    return (
        <Navbar bg="dark" variant="dark" expand="sm">
            <Container>
                <Navbar.Brand href="/expenses">Expense Manager</Navbar.Brand>
                <Nav className="ms-auto">
                    {hasToken ? (
                        <Nav.Link onClick={logout}>Logout</Nav.Link>
                    ) : (
                        <>
                            <Nav.Link href="/login">Login</Nav.Link>
                            <Nav.Link href="/register">Register</Nav.Link>
                        </>
                    )}
                </Nav>
            </Container>
        </Navbar>
    )
}
