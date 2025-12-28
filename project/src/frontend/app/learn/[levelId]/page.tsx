import LevelClient from './LevelClient';

export const dynamicParams = false;

export async function generateStaticParams() {
    return Array.from({ length: 10 }, (_, i) => ({
        levelId: (i + 1).toString(),
    }));
}

export default function LevelPage({ params }: { params: { levelId: string } }) {
    return <LevelClient params={params} />;
}
