import '@testing-library/jest-dom'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import DashboardPage from '../app/dashboard/page'
import api from '@/utils/api'
import { useRouter } from 'next/navigation'

// Mock imports
jest.mock('next/navigation', () => ({
    useRouter: jest.fn(),
}))

jest.mock('@/utils/api', () => ({
    get: jest.fn(),
}))

describe('DashboardPage', () => {
    const mockPush = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
            ; (useRouter as jest.Mock).mockReturnValue({ push: mockPush })
        localStorage.clear()
    })

    it('redirects to login if no token is present', async () => {
        render(<DashboardPage />)

        // Wait for effect to run
        await waitFor(() => {
            // Since token is missing, the API call might not happen or it handles the missing user.
            // In the provided code, it tries to fetch levels irrespective of token, 
            // but assumes token is needed for the username.
            // If api call fails (401), it should redirect.
        })

            // The component fetches levels immediately. If api fails, it redirects.
            ; (api.get as jest.Mock).mockRejectedValueOnce({ response: { status: 401 } })

        render(<DashboardPage />)
        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/login')
        })
    })

    it('renders user levels and name correctly', async () => {
        // Mock token for username "TestUser"
        // Token format: header.payload.signature. Payload needs 'sub'.
        const payload = JSON.stringify({ sub: 'TestUser' })
        const token = `header.${btoa(payload)}.signature`
        localStorage.setItem('token', token)

        // Mock levels response
        const mockLevels = [
            { id: 1, name: 'Level 1', description: 'Basics', order: 1 }
        ]
            ; (api.get as jest.Mock).mockResolvedValueOnce({ data: mockLevels })

        render(<DashboardPage />)

        expect(await screen.findByText('TestUser')).toBeInTheDocument()
        expect(await screen.findByRole('heading', { name: 'Level 1' })).toBeInTheDocument()
        expect(screen.getByText('Basics')).toBeInTheDocument()
    })

    it('handles sign out', async () => {
        const payload = JSON.stringify({ sub: 'User' })
        localStorage.setItem('token', `h.${btoa(payload)}.s`)
            ; (api.get as jest.Mock).mockResolvedValue({ data: [] })

        render(<DashboardPage />)

        // Open menu
        const menuButton = screen.getByText('User').closest('button')
        fireEvent.click(menuButton!)

        // Click sign out
        const signOutBtn = screen.getByText('Sign Out')
        fireEvent.click(signOutBtn)

        expect(localStorage.getItem('token')).toBeNull()
        expect(mockPush).toHaveBeenCalledWith('/login')
    })
})
