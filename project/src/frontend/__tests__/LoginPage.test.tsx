import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LoginPage from '../app/login/page'
import api from '@/utils/api'

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}))

// Mock API
jest.mock('@/utils/api', () => ({
    post: jest.fn(),
}))

describe('LoginPage', () => {
    beforeEach(() => {
        jest.clearAllMocks()
        localStorage.clear()
    })

    it('renders login form', () => {
        render(<LoginPage />)
        expect(screen.getByPlaceholderText(/username/i)).toBeInTheDocument()
        expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
    })

    it('handles successful login (integration flow simulation)', async () => {
        // user "registers" by us defining the expected valid credentials
        const validUser = { username: 'testuser', password: 'password123' }

            // Mock successful API response
            ; (api.post as jest.Mock).mockResolvedValueOnce({
                data: { access_token: 'valid-token' }
            })

        render(<LoginPage />)

        // User enters credentials
        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: validUser.username } })
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: validUser.password } })

        // Click login
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

        // Assertion: Verify API was called with form data
        await waitFor(() => {
            expect(api.post).toHaveBeenCalledWith(
                '/auth/login',
                expect.any(FormData),
                expect.objectContaining({
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
                })
            )
        })

        // Verify token storage
        expect(localStorage.getItem('token')).toBe('valid-token')
    })

    it('shows error for non-existent user (invalid credentials)', async () => {
        // Mock API error for user not found/wrong password
        ; (api.post as jest.Mock).mockRejectedValueOnce({
            response: { status: 401 }
        })

        render(<LoginPage />)

        fireEvent.change(screen.getByPlaceholderText(/username/i), { target: { value: 'ghostuser' } })
        fireEvent.change(screen.getByPlaceholderText(/password/i), { target: { value: 'wrongpass' } })
        fireEvent.click(screen.getByRole('button', { name: /sign in/i }))

        await waitFor(() => {
            expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
        })
    })

    it('requires both fields to be present', () => {
        render(<LoginPage />)
        const usernameInput = screen.getByPlaceholderText(/username/i)
        const passwordInput = screen.getByPlaceholderText(/password/i)

        expect(usernameInput).toBeRequired()
        expect(passwordInput).toBeRequired()
    })
})
