import LevelClient from './LevelClient';

export default function LevelPage({ params }: { params: { levelId: string } }) {
    return <LevelClient params={params} />;
}
