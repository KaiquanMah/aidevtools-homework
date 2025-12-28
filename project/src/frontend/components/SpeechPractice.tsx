"use client";

import { useState, useRef, useEffect } from 'react';
import api from '@/utils/api';

interface VocabularyWord {
    finnish: string;
    english: string;
    pronunciation: string;
}

interface GradeResult {
    transcription: string;
    score: number;
    issues: string[];
    feedback: string;
    correct: boolean;
}

interface SpeechPracticeProps {
    vocabulary: VocabularyWord[];
    lessonTitle: string;
}

// Extend Window interface for SpeechRecognition
declare global {
    interface Window {
        SpeechRecognition: typeof SpeechRecognition;
        webkitSpeechRecognition: typeof SpeechRecognition;
    }
}

export default function SpeechPractice({ vocabulary, lessonTitle }: SpeechPracticeProps) {
    const [currentWordIndex, setCurrentWordIndex] = useState(0);
    const [isListening, setIsListening] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [result, setResult] = useState<GradeResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [transcript, setTranscript] = useState<string>('');
    const [browserSupported, setBrowserSupported] = useState(true);

    const recognitionRef = useRef<SpeechRecognition | null>(null);

    const currentWord = vocabulary[currentWordIndex];

    // Check browser support on mount
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setBrowserSupported(false);
        }
    }, []);

    const startListening = () => {
        setError(null);
        setResult(null);
        setTranscript('');

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            setError('Speech recognition not supported in this browser. Please use Chrome or Safari.');
            return;
        }

        const recognition = new SpeechRecognition();
        recognitionRef.current = recognition;

        // Configure for Finnish
        recognition.lang = 'fi-FI';
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
        };

        recognition.onresult = (event: SpeechRecognitionEvent) => {
            const result = event.results[event.results.length - 1];
            const transcriptText = result[0].transcript;
            setTranscript(transcriptText);

            // If this is a final result, grade it
            if (result.isFinal) {
                gradeTranscription(transcriptText);
            }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
            setIsListening(false);
            if (event.error === 'no-speech') {
                setError('No speech detected. Please try again.');
            } else if (event.error === 'not-allowed') {
                setError('Microphone access denied. Please allow microphone access.');
            } else {
                setError(`Speech recognition error: ${event.error}`);
            }
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.start();
    };

    const stopListening = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
            setIsListening(false);
        }
    };

    const gradeTranscription = async (spokenText: string) => {
        setIsProcessing(true);
        setError(null);

        try {
            const response = await api.post('/practice/grade-text', {
                spoken_text: spokenText,
                target_text: currentWord.finnish
            });

            setResult(response.data);
        } catch (err: unknown) {
            const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
            setError('Failed to grade speech. Please try again. ' + errorMessage);
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    const nextWord = () => {
        setResult(null);
        setTranscript('');
        setCurrentWordIndex((prev: number) => (prev + 1) % vocabulary.length);
    };

    const prevWord = () => {
        setResult(null);
        setTranscript('');
        setCurrentWordIndex((prev: number) => (prev - 1 + vocabulary.length) % vocabulary.length);
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreEmoji = (score: number) => {
        if (score >= 90) return '🌟';
        if (score >= 80) return '✨';
        if (score >= 60) return '👍';
        if (score >= 40) return '💪';
        return '🔄';
    };

    if (!browserSupported) {
        return (
            <div className="bg-yellow-50 border border-yellow-200 p-6 rounded-lg text-center">
                <h3 className="text-xl font-bold text-yellow-700 mb-2">Browser Not Supported</h3>
                <p className="text-yellow-600">
                    Speech recognition requires Chrome, Safari, or Edge browser.
                    Please switch to one of these browsers to use speaking practice.
                </p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-xl font-bold text-indigo-600 mb-4">
                🎤 Speaking Practice - {lessonTitle}
            </h3>

            {/* Word Navigation */}
            <div className="flex items-center justify-between mb-6">
                <button
                    onClick={prevWord}
                    className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                    disabled={isListening || isProcessing}
                >
                    ← Prev
                </button>
                <span className="text-gray-500">
                    Word {currentWordIndex + 1} of {vocabulary.length}
                </span>
                <button
                    onClick={nextWord}
                    className="px-3 py-1 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                    disabled={isListening || isProcessing}
                >
                    Next →
                </button>
            </div>

            {/* Current Word Display */}
            <div className="text-center mb-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
                <p className="text-4xl font-bold text-indigo-700 mb-2">
                    {currentWord.finnish}
                </p>
                <p className="text-xl text-gray-600 mb-1">
                    {currentWord.english}
                </p>
                <p className="text-sm text-gray-500 italic">
                    💡 Pronunciation: {currentWord.pronunciation}
                </p>
            </div>

            {/* Live Transcript */}
            {transcript && !result && (
                <div className="text-center mb-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-gray-500">Hearing:</p>
                    <p className="text-lg font-medium text-blue-700">{transcript}</p>
                </div>
            )}

            {/* Recording Controls */}
            <div className="text-center mb-6">
                {!isListening ? (
                    <button
                        onClick={startListening}
                        disabled={isProcessing}
                        className={`px-8 py-4 rounded-full font-bold text-lg transition ${isProcessing
                                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                : 'bg-red-500 text-white hover:bg-red-600'
                            }`}
                    >
                        🎙️ {isProcessing ? 'Grading...' : 'Start Speaking'}
                    </button>
                ) : (
                    <button
                        onClick={stopListening}
                        className="px-8 py-4 bg-gray-700 text-white rounded-full font-bold text-lg hover:bg-gray-800 transition animate-pulse"
                    >
                        ⏹️ Stop & Grade
                    </button>
                )}

                {isListening && (
                    <p className="mt-2 text-sm text-gray-500 animate-pulse">
                        🔴 Listening... Say "{currentWord.finnish}"
                    </p>
                )}
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {/* Results */}
            {result && (
                <div className={`p-6 rounded-lg border-2 ${result.correct
                        ? 'bg-green-50 border-green-300'
                        : 'bg-amber-50 border-amber-300'
                    }`}>
                    <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-lg">
                            {getScoreEmoji(result.score)} Results
                        </h4>
                        <span className={`text-3xl font-bold ${getScoreColor(result.score)}`}>
                            {result.score}/100
                        </span>
                    </div>

                    <div className="space-y-3">
                        <div>
                            <span className="font-semibold text-gray-600">You said: </span>
                            <span className="text-gray-800">{result.transcription}</span>
                        </div>

                        <div>
                            <span className="font-semibold text-gray-600">Target: </span>
                            <span className="text-gray-800">{currentWord.finnish}</span>
                        </div>

                        {result.issues.length > 0 && (
                            <div>
                                <span className="font-semibold text-gray-600">Issues: </span>
                                <ul className="list-disc list-inside text-gray-700">
                                    {result.issues.map((issue: string, i: number) => (
                                        <li key={i}>{issue}</li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="mt-4 p-3 bg-white rounded-lg">
                            <span className="font-semibold text-indigo-600">💬 Feedback: </span>
                            <p className="text-gray-700">{result.feedback}</p>
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <button
                            onClick={() => { setResult(null); setTranscript(''); }}
                            className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
