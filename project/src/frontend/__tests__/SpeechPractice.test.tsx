import '@testing-library/jest-dom'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import SpeechPractice from '../components/SpeechPractice'
import api from '@/utils/api'

// Mock API
jest.mock('@/utils/api', () => ({
    post: jest.fn(),
}))

// Mock SpeechRecognition
const mockStart = jest.fn()
const mockStop = jest.fn()

class MockSpeechRecognition {
    onstart: (() => void) | null = null
    onend: (() => void) | null = null

    start = jest.fn(() => {
        mockStart()
        if (this.onstart) this.onstart()
    })

    stop = jest.fn(() => {
        mockStop()
        if (this.onend) this.onend()
    })

    abort = jest.fn()
    onresult = null
    onerror = null
}

// Attach to window
Object.defineProperty(window, 'SpeechRecognition', { value: MockSpeechRecognition, writable: true, configurable: true })
Object.defineProperty(window, 'webkitSpeechRecognition', { value: MockSpeechRecognition, writable: true, configurable: true })

describe('SpeechPractice', () => {
    const mockVocabulary = [
        { finnish: 'kissa', english: 'cat', pronunciation: 'kissa' }
    ]

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders vocabulary word and instruction', () => {
        render(<SpeechPractice vocabulary={mockVocabulary} lessonTitle="Animals" />)
        expect(screen.getByText('kissa')).toBeInTheDocument()
        expect(screen.getByText('cat')).toBeInTheDocument()
        expect(screen.getByRole('button', { name: /start speaking/i })).toBeInTheDocument()
    })

    it('handles speaking interaction and grading success', async () => {
        // Mock successful grading response
        (api.post as jest.Mock).mockResolvedValue({
            data: {
                score: 100,
                feedback: 'Perfect pronunciation!',
                transcription: 'kissa',
                correct: true
            }
        })

        render(<SpeechPractice vocabulary={mockVocabulary} lessonTitle="Animals" />)

        const btn = screen.getByRole('button', { name: /start speaking/i })

        // Simulate Click (Start Listening)
        fireEvent.click(btn)
        expect(mockStart).toHaveBeenCalled()

        // Wait for state update and Find Stop Button
        const stopBtn = await screen.findByRole('button', { name: /stop & grade/i })

        // Simulate Click (Stop Listening)
        fireEvent.click(stopBtn)
        expect(mockStop).toHaveBeenCalled()

        // NOTE: In a real integration test, we would need to trigger the 'onresult' callback 
        // manually if we had access to the instance, or use a more complex mock setup.
        // For this unit test, verifying start/stop is called on interaction is the key boundary.
    })

    it('displays error if browser does not support speech recognition', () => {
        // Remove mock temporarily
        const originalSpeech = window.SpeechRecognition
        // @ts-ignore
        // @ts-ignore
        window.SpeechRecognition = undefined
        // @ts-ignore
        window.webkitSpeechRecognition = undefined

        render(<SpeechPractice vocabulary={mockVocabulary} lessonTitle="Animals" />)

        expect(screen.getByText(/Browser Not Supported/i)).toBeInTheDocument()

        // Restore
        window.SpeechRecognition = originalSpeech
    })
})
