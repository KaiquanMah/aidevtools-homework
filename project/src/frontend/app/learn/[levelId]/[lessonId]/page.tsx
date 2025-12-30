import LessonClient from './LessonClient';

export default function LessonPage({ params }: { params: { levelId: string; lessonId: string } }) {
    return <LessonClient params={params} />;
}
