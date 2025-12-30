import LevelClient from './LevelClient';

export const dynamic = 'force-static';

export async function generateStaticParams() {
    return [
        { levelId: '1' },
        { levelId: '2' },
        { levelId: '3' },
    ];
}

export default function LevelPage({ params }: { params: { levelId: string } }) {
    return <LevelClient params={params} />;
}
