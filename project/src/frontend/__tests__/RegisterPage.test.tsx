import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import RegisterPage from '../app/register/page'

// Mock next/navigation
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}))

describe('RegisterPage', () => {
    it('renders a heading', () => {
        render(<RegisterPage />)

        const heading = screen.getByRole('heading', {
            name: /create an account/i,
        })

        expect(heading).toBeInTheDocument()
    })

    it('renders username and password inputs', () => {
        render(<RegisterPage />)

        const usernameInput = screen.getByPlaceholderText(/username/i)
        const passwordInput = screen.getByPlaceholderText(/password/i)

        expect(usernameInput).toBeInTheDocument()
        expect(passwordInput).toBeInTheDocument()
    })
})
