"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';
import SpeechPractice from '@/components/SpeechPractice';

interface Exercise {
    id: number;
    question: string;
    options: string[];
    correct_answer: string;
    explanation?: string;
}

interface LessonDetail {
    id: number;
    title: string;
    content: string;
    exercises: Exercise[];
}

interface VocabularyWord {
    finnish: string;
    english: string;
    pronunciation: string;
}

interface VocabularyData {
    lesson_id: number;
    lesson_title: string;
    vocabulary: VocabularyWord[];
}

const QUESTIONS_PER_SET = 10;

export default function LessonClient({ params }: { params: { levelId: string; lessonId: string } }) {
    const [lesson, setLesson] = useState<LessonDetail | null>(null);
    const [currentStep, setCurrentStep] = useState<'content' | 'quiz' | 'speaking'>('content');
    const [currentSetIndex, setCurrentSetIndex] = useState(0);
    const [answeredQuestions, setAnsweredQuestions] = useState<Record<number, { selected: string, correct: boolean }>>({});
    const [quizComplete, setQuizComplete] = useState(false);
    const [vocabulary, setVocabulary] = useState<VocabularyData | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const response = await api.get(`/lessons/${params.lessonId}`);
                setLesson(response.data);
            } catch (err) {
                console.error(err);
            }
        };

        const fetchVocabulary = async () => {
            try {
                // Determine lesson order within level (simplified: use lessonId as order for now)
                const response = await api.get(`/practice/vocabulary/${params.levelId}/${params.lessonId}`);
                setVocabulary(response.data);
            } catch (err) {
                console.error('Vocabulary not available for this lesson');
            }
        };

        fetchLesson();
        fetchVocabulary();
    }, [params.lessonId, params.levelId]);

    useEffect(() => {
        const fetchLesson = async () => {
            try {
                const response = await api.get(`/lessons/${params.lessonId}`);
                setLesson(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchLesson();
    }, [params.lessonId]);

    // Calculate quiz sets
    const totalQuestions = lesson?.exercises.length || 0;
    const totalSets = Math.ceil(totalQuestions / QUESTIONS_PER_SET);
    const currentSetStart = currentSetIndex * QUESTIONS_PER_SET;
    const currentSetEnd = Math.min(currentSetStart + QUESTIONS_PER_SET, totalQuestions);
    const currentExercises = lesson?.exercises.slice(currentSetStart, currentSetEnd) || [];

    // Calculate score
    const totalAnswered = Object.keys(answeredQuestions).length;
    const totalCorrect = Object.values(answeredQuestions).filter(a => a.correct).length;
    const scorePercent = totalQuestions > 0 ? (totalCorrect / totalQuestions) * 100 : 0;

    const handleAnswerSelect = (exerciseId: number, selectedOption: string, correctAnswer: string) => {
        // Only allow answering once per question
        if (answeredQuestions[exerciseId]) return;

        const isCorrect = selectedOption === correctAnswer;
        setAnsweredQuestions(prev => ({
            ...prev,
            [exerciseId]: { selected: selectedOption, correct: isCorrect }
        }));
    };

    const handleSetChange = (setIndex: number) => {
        if (setIndex >= 0 && setIndex < totalSets) {
            setCurrentSetIndex(setIndex);
        }
    };

    const handleFinishQuiz = async () => {
        setQuizComplete(true);
        const passed = scorePercent >= 70;

        if (passed && lesson) {
            try {
                await api.post(`/users/progress/${lesson.id}`, { is_completed: true });
            } catch (e) {
                console.error("Failed to save progress", e);
            }
        }
    };

    const allQuestionsAnswered = totalAnswered === totalQuestions;

    if (!lesson) return <div className="p-8">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="p-6 border-b">
                    <Link href={`/learn/${params.levelId}`} className="text-sm text-gray-500 hover:underline mb-2 block">&larr; Back to Lessons</Link>
                    <h1 className="text-3xl font-bold">{lesson.title}</h1>
                </div>

                <div className="p-6">
                    {currentStep === 'content' && (
                        <div>
                            <div className="prose max-w-none mb-8 whitespace-pre-line">
                                {lesson.content}
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col md:flex-row gap-4 mb-8">
                                {lesson.exercises.length > 0 && (
                                    <button
                                        onClick={() => setCurrentStep('quiz')}
                                        className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-500 flex-1"
                                    >
                                        📝 Start Quiz ({totalQuestions} questions)
                                    </button>
                                )}

                                {vocabulary && vocabulary.vocabulary.length > 0 && (
                                    <button
                                        onClick={() => setCurrentStep('speaking')}
                                        className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-500 flex-1"
                                    >
                                        🎤 Practice Speaking ({vocabulary.vocabulary.length} words)
                                    </button>
                                )}
                            </div>

                            {!lesson.exercises.length && !vocabulary && (
                                <div className="text-gray-500 italic">No activities available for this lesson yet.</div>
                            )}

                            <div className="mt-8 p-4 bg-blue-50 rounded border border-blue-200">
                                <h3 className="font-bold text-blue-800 mb-2">🎧 Podcast AI (Coming Soon)</h3>
                                <p className="text-sm text-blue-700">Listen to an AI-generated conversation about this lesson.</p>
                            </div>
                        </div>
                    )}

                    {/* Speaking Practice Mode */}
                    {currentStep === 'speaking' && vocabulary && (
                        <div>
                            <button
                                onClick={() => setCurrentStep('content')}
                                className="mb-6 text-gray-600 hover:text-gray-800 flex items-center"
                            >
                                ← Back to Lesson
                            </button>
                            <SpeechPractice
                                vocabulary={vocabulary.vocabulary}
                                lessonTitle={lesson.title}
                            />
                        </div>
                    )}

                    {currentStep === 'quiz' && !quizComplete && (
                        <div className="space-y-6">
                            {/* Progress Header */}
                            <div className="flex justify-between items-center p-4 bg-gray-100 rounded-lg">
                                <div>
                                    <span className="font-semibold">Set {currentSetIndex + 1} of {totalSets}</span>
                                    <span className="text-gray-500 ml-4">
                                        Questions {currentSetStart + 1}-{currentSetEnd} of {totalQuestions}
                                    </span>
                                </div>
                                <div className="text-right">
                                    <span className="text-green-600 font-bold">{totalCorrect} correct</span>
                                    <span className="text-gray-400 mx-2">/</span>
                                    <span className="text-gray-600">{totalAnswered} answered</span>
                                </div>
                            </div>

                            {/* Set Tabs - Free Navigation */}
                            {totalSets > 1 && (
                                <div className="flex flex-wrap gap-2">
                                    {Array.from({ length: totalSets }, (_, i) => {
                                        // Count answered questions in this set
                                        const setStart = i * QUESTIONS_PER_SET;
                                        const setEnd = Math.min(setStart + QUESTIONS_PER_SET, totalQuestions);
                                        const setExercises = lesson.exercises.slice(setStart, setEnd);
                                        const answeredInSet = setExercises.filter(ex => answeredQuestions[ex.id]).length;

                                        return (
                                            <button
                                                key={i}
                                                onClick={() => handleSetChange(i)}
                                                className={`px-4 py-2 rounded-lg font-medium transition ${currentSetIndex === i
                                                    ? 'bg-indigo-600 text-white'
                                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                                    }`}
                                            >
                                                Set {i + 1}
                                                {answeredInSet > 0 && (
                                                    <span className="ml-1 text-xs opacity-75">({answeredInSet}/{setExercises.length})</span>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Questions */}
                            <div className="space-y-6">
                                {currentExercises.map((ex, idx) => {
                                    const answered = answeredQuestions[ex.id];
                                    const questionNum = currentSetStart + idx + 1;

                                    return (
                                        <div key={ex.id} className={`p-4 border rounded-lg ${answered ? 'bg-gray-50' : 'bg-white'}`}>
                                            <p className="font-semibold mb-3">{questionNum}. {ex.question}</p>
                                            <div className="space-y-2">
                                                {ex.options.map((opt) => {
                                                    let optionClass = "flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition";

                                                    if (answered) {
                                                        if (opt === ex.correct_answer) {
                                                            // Correct answer - always show green
                                                            optionClass += " bg-green-100 border-green-500 text-green-800";
                                                        } else if (opt === answered.selected && !answered.correct) {
                                                            // Wrong selection - show red
                                                            optionClass += " bg-red-100 border-red-500 text-red-800";
                                                        } else {
                                                            optionClass += " bg-gray-50 border-gray-200 text-gray-500";
                                                        }
                                                    } else {
                                                        optionClass += " hover:bg-indigo-50 hover:border-indigo-300";
                                                    }

                                                    return (
                                                        <div
                                                            key={opt}
                                                            className={optionClass}
                                                            onClick={() => handleAnswerSelect(ex.id, opt, ex.correct_answer)}
                                                        >
                                                            <span className="flex-1">{opt}</span>
                                                            {answered && opt === ex.correct_answer && (
                                                                <span className="text-green-600 font-bold">✓</span>
                                                            )}
                                                            {answered && opt === answered.selected && !answered.correct && (
                                                                <span className="text-red-600 font-bold">✗</span>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>

                                            {/* Explanation - shows for BOTH correct and incorrect answers */}
                                            {answered && (
                                                <div className={`mt-3 p-3 rounded-lg ${answered.correct ? 'bg-green-50 border border-green-200' : 'bg-amber-50 border border-amber-200'}`}>
                                                    <p className={answered.correct ? 'text-green-700' : 'text-amber-700'}>
                                                        <span className="font-bold">{answered.correct ? '✓ Correct!' : '✗ Incorrect.'}</span>
                                                        {' '}The correct answer is <strong>{ex.correct_answer}</strong>
                                                    </p>
                                                    {ex.explanation && (
                                                        <p className={`mt-2 text-sm ${answered.correct ? 'text-green-600' : 'text-amber-600'}`}>
                                                            💡 {ex.explanation}
                                                        </p>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Navigation */}
                            <div className="flex justify-between items-center pt-4 border-t">
                                <button
                                    onClick={() => handleSetChange(currentSetIndex - 1)}
                                    disabled={currentSetIndex === 0}
                                    className={`px-4 py-2 rounded-lg font-semibold ${currentSetIndex === 0
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-gray-600 text-white hover:bg-gray-500'
                                        }`}
                                >
                                    ← Previous Set
                                </button>

                                <button
                                    onClick={handleFinishQuiz}
                                    disabled={!allQuestionsAnswered}
                                    className={`px-6 py-2 rounded-lg font-semibold ${!allQuestionsAnswered
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-green-600 text-white hover:bg-green-500'
                                        }`}
                                >
                                    Finish Quiz ({totalAnswered}/{totalQuestions})
                                </button>

                                <button
                                    onClick={() => handleSetChange(currentSetIndex + 1)}
                                    disabled={currentSetIndex >= totalSets - 1}
                                    className={`px-4 py-2 rounded-lg font-semibold ${currentSetIndex >= totalSets - 1
                                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                        : 'bg-indigo-600 text-white hover:bg-indigo-500'
                                        }`}
                                >
                                    Next Set →
                                </button>
                            </div>
                        </div>
                    )}

                    {quizComplete && (
                        <div className="text-center py-8">
                            <h2 className={`text-4xl font-bold mb-4 ${scorePercent >= 70 ? 'text-green-600' : 'text-red-600'}`}>
                                {scorePercent >= 70 ? '🎉 Passed!' : '😔 Try Again'}
                            </h2>
                            <p className="text-xl mb-2">
                                Score: <strong>{totalCorrect}</strong> / {totalQuestions} ({scorePercent.toFixed(0)}%)
                            </p>
                            <p className="text-gray-600 mb-6">
                                {scorePercent >= 70
                                    ? 'Great job! Your progress has been saved.'
                                    : 'You need at least 70% to pass. Review the lesson and try again!'}
                            </p>

                            <div className="space-x-4">
                                <Link
                                    href={`/learn/${params.levelId}`}
                                    className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-500"
                                >
                                    Return to Level
                                </Link>
                                {scorePercent < 70 && (
                                    <button
                                        onClick={() => {
                                            setQuizComplete(false);
                                            setAnsweredQuestions({});
                                            setCurrentSetIndex(0);
                                        }}
                                        className="inline-block bg-gray-800 text-white px-6 py-3 rounded-lg font-bold hover:bg-gray-700"
                                    >
                                        Retry Quiz
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
