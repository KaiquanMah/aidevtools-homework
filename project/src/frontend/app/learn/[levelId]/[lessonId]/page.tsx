import LessonClient from './LessonClient';

export const dynamic = 'force-static';

export async function generateStaticParams() {
    const params: { levelId: string; lessonId: string }[] = [];

    // Level 1: 3 lessons
    [1, 2, 3].forEach(id => params.push({ levelId: '1', lessonId: id.toString() }));
    // Level 2: 2 lessons
    [4, 5].forEach(id => params.push({ levelId: '2', lessonId: id.toString() }));
    // Level 3: 2 lessons
    [6, 7].forEach(id => params.push({ levelId: '3', lessonId: id.toString() }));

    return params;
}

export default function LessonPage({ params }: { params: { levelId: string; lessonId: string } }) {
    return <LessonClient params={params} />;
}
