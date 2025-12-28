import LessonClient from './LessonClient';

export const dynamicParams = false;

export async function generateStaticParams() {
    const params = [];
    for (let levelId = 1; levelId <= 10; levelId++) {
        for (let lessonId = 1; lessonId <= 50; lessonId++) {
            params.push({
                levelId: levelId.toString(),
                lessonId: lessonId.toString(),
            });
        }
    }
    return params;
}

export default function LessonPage({ params }: { params: { levelId: string; lessonId: string } }) {
    return <LessonClient params={params} />;
}
