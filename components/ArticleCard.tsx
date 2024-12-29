interface ArticleProps {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  sentiment: number;
}

export function ArticleCard({
  title,
  description,
  url,
  publishedAt,
  sentiment,
}: ArticleProps) {
  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span
            className={`h-3 w-3 rounded-full ${
              sentiment > 0 ? "bg-green-500" : "bg-red-500"
            }`}
          />
          <span className="text-sm text-gray-500">
            {new Date(publishedAt).toLocaleDateString()}
          </span>
        </div>
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-500 hover:underline"
        >
          Read More
        </a>
      </div>
    </div>
  );
}
