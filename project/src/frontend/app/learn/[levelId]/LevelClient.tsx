"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';

interface Lesson {
    id: number;
    title: string;
    order: number;
    is_completed: boolean;
}

interface LevelDetail {
    id: number;
    name: string;
    description: string;
    lessons: Lesson[];
}

export default function LevelClient({ params }: { params: { levelId: string } }) {
    const [level, setLevel] = useState<LevelDetail | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchLevel = async () => {
            try {
                const response = await api.get(`/levels/${params.levelId}`);
                setLevel(response.data);
            } catch (err) {
                router.push('/dashboard');
            }
        };
        fetchLevel();
    }, [params.levelId, router]);

    if (!level) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-3xl mx-auto">
                <Link href="/dashboard" className="text-indigo-600 hover:underline mb-4 block">&larr; Back to Dashboard</Link>

                <h1 className="text-3xl font-bold text-gray-900 mb-2">{level.name}</h1>
                <p className="text-gray-600 mb-8">{level.description}</p>

                <div className="space-y-4">
                    {level.lessons.map((lesson) => (
                        <Link
                            key={lesson.id}
                            href={`/learn/${level.id}/${lesson.id}`}
                            className="block bg-white p-4 rounded-lg shadow hover:bg-gray-50 transition border border-gray-200"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <span className="text-gray-500 mr-2">#{lesson.order}</span>
                                    <span className="font-semibold text-lg">{lesson.title}</span>
                                </div>
                                {lesson.is_completed && (
                                    <span className="text-green-600 font-bold">✓ Completed</span>
                                )}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}
