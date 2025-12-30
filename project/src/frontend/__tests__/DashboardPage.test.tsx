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

// Polyfill atob and btoa for Node environment
if (typeof global.atob === 'undefined') {
    global.atob = (str: string) => Buffer.from(str, 'base64').toString('binary');
}
if (typeof global.btoa === 'undefined') {
    global.btoa = (str: string) => Buffer.from(str, 'binary').toString('base64');
}

describe('DashboardPage', () => {
    const mockPush = jest.fn()

    beforeEach(() => {
        jest.clearAllMocks()
            ; (useRouter as jest.Mock).mockReturnValue({ push: mockPush })
        localStorage.clear()
    })

    it('redirects to login if no token is present', async () => {
        render(<DashboardPage />)

        await waitFor(() => {
            expect(mockPush).toHaveBeenCalledWith('/login')
        })
    })

    it('renders user levels and name correctly', async () => {
        // Mock token for username "TestUser"
        const payload = JSON.stringify({ sub: 'TestUser' })
        const token = `header.${global.btoa(payload)}.signature`
        localStorage.setItem('token', token)

        // Mock levels response
        const mockLevels = [
            { id: 1, name: 'Level 1', description: 'Basics', order: 1 }
        ]
            ; (api.get as jest.Mock).mockResolvedValue({ data: mockLevels })

        render(<DashboardPage />)

        // Use findBy to wait for async updates
        const userElement = await screen.findByText('TestUser')
        expect(userElement).toBeInTheDocument()

        const levelHeading = await screen.findByText('Level 1')
        expect(levelHeading).toBeInTheDocument()

        expect(screen.getByText('Basics')).toBeInTheDocument()
    })

    it('handles sign out', async () => {
        const payload = JSON.stringify({ sub: 'User' })
        localStorage.setItem('token', `h.${global.btoa(payload)}.s`)
            ; (api.get as jest.Mock).mockResolvedValue({ data: [] })

        render(<DashboardPage />)

        // Wait for dashboard to load
        await screen.findByText('User')

        // Open menu
        const menuButton = screen.getByText('User').closest('button')
        fireEvent.click(menuButton!)

        // Click sign out
        const signOutBtn = await screen.findByText('Sign Out')
        fireEvent.click(signOutBtn)

        expect(localStorage.getItem('token')).toBeNull()
        expect(mockPush).toHaveBeenCalledWith('/login')
    })
})
