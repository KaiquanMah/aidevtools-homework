import Link from 'next/link';

export default function Home() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <div className="text-center max-w-2xl px-4">
                <h1 className="text-6xl font-bold text-primary mb-8">
                    Learn Finnish
                </h1>
                <p className="text-xl mb-12 text-gray-700">
                    Master the basics of Suomi from Level 0 to A2.2 with our interactive lessons and exercises.
                </p>

                <div className="flex gap-4 justify-center">
                    <Link
                        href="/login"
                        className="px-8 py-4 bg-primary text-white rounded-lg hover:bg-blue-800 transition font-bold"
                    >
                        Login
                    </Link>
                    <Link
                        href="/register"
                        className="px-8 py-4 border-2 border-primary text-primary rounded-lg hover:bg-blue-50 transition font-bold"
                    >
                        Start Learning
                    </Link>
                </div>
            </div>
        </div>
    );
}
