"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/utils/api';
import { useRouter } from 'next/navigation';

interface Level {
    id: number;
    name: string;
    description: string;
    order: number;
}

export default function DashboardPage() {
    const [levels, setLevels] = useState<Level[]>([]);
    const [username, setUsername] = useState<string>('');
    const [showMenu, setShowMenu] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Get username from JWT token
        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            setUsername(payload.sub || 'User');
        } catch {
            setUsername('User');
        }

        const fetchLevels = async () => {
            try {
                const response = await api.get('/levels');
                setLevels(response.data);
            } catch (err) {
                // Redirect to login if unauthorized
                router.push('/login');
            }
        };
        fetchLevels();
    }, [router]);

    const handleSignOut = () => {
        localStorage.removeItem('token');
        router.push('/login');
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header with user menu */}
            <header className="bg-white shadow-sm">
                <div className="max-w-4xl mx-auto px-8 py-4 flex justify-between items-center">
                    <h1 className="text-xl font-bold text-indigo-600">Finnish Learner</h1>

                    {/* User dropdown */}
                    <div className="relative">
                        <button
                            onClick={() => setShowMenu(!showMenu)}
                            className="flex items-center space-x-2 bg-gray-100 hover:bg-gray-200 rounded-full px-4 py-2 transition"
                        >
                            <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                                {username.charAt(0).toUpperCase()}
                            </div>
                            <span className="text-gray-700 font-medium">{username}</span>
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>

                        {/* Dropdown menu */}
                        {showMenu && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-10 border">
                                <div className="px-4 py-2 border-b">
                                    <p className="text-sm text-gray-500">Signed in as</p>
                                    <p className="font-semibold text-gray-800 truncate">{username}</p>
                                </div>
                                <button
                                    onClick={handleSignOut}
                                    className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition"
                                >
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main content */}
            <div className="p-8">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8">My Learning Path</h2>

                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {levels.map((level) => (
                            <div key={level.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-xl font-bold text-primary">{level.name}</h3>
                                    <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">
                                        Level {level.order}
                                    </span>
                                </div>

                                <p className="text-gray-600 mb-6">{level.description}</p>

                                <Link
                                    href={`/learn/${level.id}`}
                                    className="block w-full text-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded hover:bg-indigo-500 transition"
                                >
                                    Start Learning
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
