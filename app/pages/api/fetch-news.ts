import { NextApiRequest, NextApiResponse } from 'next';
import { database } from '../../../lib/appwrite';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        // Fetch news from The News API
        const newsResponse = await fetch(
            `https://api.thenewsapi.com/v1/news/all?api_token=${process.env.NEWS_API_KEY}&language=en`
        );
        const newsData = await newsResponse.json();

        // Store articles in Appwrite
        for (const article of newsData.data) {
            await database.createDocument(
                'YOUR_DATABASE_ID',
                'articles',
                'unique()',
                {
                    title: article.title,
                    description: article.description,
                    url: article.url,
                    publishedAt: article.published_at,
                    sentiment: await analyzeSentiment(article.description)
                }
            );
        }

        res.status(200).json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch news' });
    }
}