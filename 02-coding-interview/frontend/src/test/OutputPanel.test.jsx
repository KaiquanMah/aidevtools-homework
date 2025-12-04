import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import OutputPanel from '../components/OutputPanel'

describe('OutputPanel Component', () => {
    it('renders output panel', () => {
        render(<OutputPanel output="" error={null} onClear={() => { }} />)

        expect(screen.getByText('Output')).toBeInTheDocument()
    })

    it('displays placeholder when no output', () => {
        render(<OutputPanel output="" error={null} onClear={() => { }} />)

        expect(screen.getByText(/run code to see output/i)).toBeInTheDocument()
    })

    it('displays output when provided', () => {
        const testOutput = 'Hello World!'
        render(<OutputPanel output={testOutput} error={null} onClear={() => { }} />)

        expect(screen.getByText(testOutput)).toBeInTheDocument()
    })

    it('shows clear button when output exists', () => {
        render(<OutputPanel output="Some output" error={null} onClear={() => { }} />)

        expect(screen.getByText('Clear')).toBeInTheDocument()
    })

    it('does not show clear button when no output', () => {
        render(<OutputPanel output="" error={null} onClear={() => { }} />)

        expect(screen.queryByText('Clear')).not.toBeInTheDocument()
    })
})
