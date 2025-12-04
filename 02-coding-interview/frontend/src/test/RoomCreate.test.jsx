import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import RoomCreate from '../components/RoomCreate'

describe('RoomCreate Component', () => {
    it('renders create room button', () => {
        render(
            <BrowserRouter>
                <RoomCreate />
            </BrowserRouter>
        )

        expect(screen.getByText('Create New Room')).toBeInTheDocument()
    })

    it('renders join room input', () => {
        render(
            <BrowserRouter>
                <RoomCreate />
            </BrowserRouter>
        )

        expect(screen.getByPlaceholderText(/enter room id/i)).toBeInTheDocument()
    })

    it('renders join button', () => {
        render(
            <BrowserRouter>
                <RoomCreate />
            </BrowserRouter>
        )

        expect(screen.getByText('Join Room')).toBeInTheDocument()
    })
})
