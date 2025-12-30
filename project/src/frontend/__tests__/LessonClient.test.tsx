import '@testing-library/jest-dom'
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react'
import LessonClient from '../app/learn/[levelId]/[lessonId]/LessonClient'
import api from '@/utils/api'

// Mock API and Router
jest.mock('@/utils/api', () => ({
    get: jest.fn(),
    post: jest.fn(),
}))

jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() }),
}))

// Mock SpeechPractice to isolate LessonClient testing
jest.mock('@/components/SpeechPractice', () => {
    return function MockSpeechPractice() {
        return <div data-testid="speech-practice">Speech Practice Mock</div>
    }
})

describe('LessonClient', () => {
    const mockLesson = {
        id: 1,
        title: 'Test Lesson',
        content: 'Lesson content here.',
        exercises: [
            {
                id: 101,
                question: 'Question 1?',
                options: ['A', 'B'],
                correct_answer: 'A',
                explanation: 'A is correct.'
            },
            {
                id: 102,
                question: 'Question 2?',
                options: ['C', 'D'],
                correct_answer: 'D'
            }
        ]
    }

    const mockVocabulary = {
        lesson_id: 1,
        lesson_title: 'Test Lesson',
        vocabulary: [{ finnish: 'kissa', english: 'cat', pronunciation: 'kissa' }]
    }

    beforeEach(() => {
        jest.clearAllMocks()
    })

    it('renders lesson content and buttons', async () => {
        (api.get as jest.Mock).mockImplementation((url) => {
            if (url.includes('/lessons/')) return Promise.resolve({ data: mockLesson })
            if (url.includes('/vocabulary/')) return Promise.resolve({ data: mockVocabulary })
            return Promise.reject(new Error('not found'))
        })

        await act(async () => {
            render(<LessonClient params={{ levelId: '1', lessonId: '1' }} />)
        })

        expect(screen.getByText('Test Lesson')).toBeInTheDocument()
        expect(screen.getByText('Lesson content here.')).toBeInTheDocument()
        expect(screen.getByText(/Start Quiz/)).toBeInTheDocument()
        expect(screen.getByText(/Practice Speaking/)).toBeInTheDocument()
    })

    it('handles quiz flow: answering correctly and finishing', async () => {
        (api.get as jest.Mock).mockImplementation((url) => {
            if (url.includes('/lessons/')) return Promise.resolve({ data: mockLesson })
            if (url.includes('/vocabulary/')) return Promise.resolve({ data: null }) // No vocab
            return Promise.reject(new Error('not found'))
        })

        await act(async () => {
            render(<LessonClient params={{ levelId: '1', lessonId: '1' }} />)
        })

        // Start Quiz
        fireEvent.click(screen.getByText(/Start Quiz/))

        // Answer Question 1 correctly
        fireEvent.click(screen.getByText('A'))
        expect(screen.getByText('✓ Correct!')).toBeInTheDocument()

        // Answer Question 2 correctly
        fireEvent.click(screen.getByText('D'))

        // Finish Quiz
        fireEvent.click(screen.getByText(/Finish Quiz/))

        // Verify Success State
        expect(screen.getByText('🎉 Passed!')).toBeInTheDocument()

        // Verify Progress Saved
        expect(api.post).toHaveBeenCalledWith('/users/progress/1', { is_completed: true })
    })

    it('does not save progress if score is low', async () => {
        (api.get as jest.Mock).mockImplementation((url) => {
            if (url.includes('/lessons/')) return Promise.resolve({ data: mockLesson })
            if (url.includes('/vocabulary/')) return Promise.resolve({ data: mockVocabulary })
            return Promise.reject(new Error('not found'))
        })

        await act(async () => {
            render(<LessonClient params={{ levelId: '1', lessonId: '1' }} />)
        })

        fireEvent.click(screen.getByText(/Start Quiz/))

        // Answer wrong
        fireEvent.click(screen.getByText('B')) // Correct is A
        fireEvent.click(screen.getByText('C')) // Correct is D

        fireEvent.click(screen.getByText(/Finish Quiz/))

        expect(screen.getByText('😔 Try Again')).toBeInTheDocument()
        expect(api.post).not.toHaveBeenCalled()
    })

    it('navigates to speaking practice', async () => {
        (api.get as jest.Mock).mockImplementation((url) => {
            if (url.includes('vocabulary')) return Promise.resolve({ data: mockVocabulary })
            return Promise.resolve({ data: mockLesson })
        })

        await act(async () => {
            render(<LessonClient params={{ levelId: '1', lessonId: '1' }} />)
        })

        fireEvent.click(screen.getByText(/Practice Speaking/))
        expect(screen.getByTestId('speech-practice')).toBeInTheDocument()
    })
})
