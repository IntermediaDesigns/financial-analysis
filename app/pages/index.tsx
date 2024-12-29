import { useEffect, useState } from 'react';
import { database } from '@/lib/appwrite';
import { Query } from 'appwrite';

export default function Home() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const response = await database.listDocuments(
                    'YOUR_DATABASE_ID',
                    'articles',
                    [
                        Query.orderDesc('publishedAt'),
                        Query.limit(20)
                    ]
                );
                setArticles(response.documents);
            } catch (error) {
                console.error('Error fetching articles:', error);
            }
            setLoading(false);
        };

        fetchArticles();
    }, []);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6">Financial News Dashboard</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {articles.map((article) => (
                        <div key={article.$id} className="border rounded-lg p-4">
                            <h2 className="text-xl font-semibold mb-2">
                                {article.title}
                            </h2>
                            <p className="text-gray-600 mb-4">
                                {article.description}
                            </p>
                            <div className="flex justify-between items-center">
                                <span className="text-sm text-gray-500">
                                    {new Date(article.publishedAt).toLocaleDateString()}
                                </span>
                                <a
                                    href={article.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline"
                                >
                                    Read More
                                </a>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}