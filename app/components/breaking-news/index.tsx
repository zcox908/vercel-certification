import Link from "next/link";
import { getBreakingNews } from "@/lib/news-api";

export default async function BreakingNewsBanner() {
  const res = await getBreakingNews();
  if (!res.success) return null;

  const item = res.data;

  return (
    <Link
      href={`/articles/${item.articleId}`}
      className="block border-y border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950"
    >
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3 text-sm">
        <span className="font-bold uppercase text-red-600 shrink-0">
          {item.urgent ? "Breaking" : "Latest"}
        </span>
        <span className="font-medium truncate">{item.headline}</span>
        <span className="text-zinc-500 truncate hidden md:inline">
          — {item.summary}
        </span>
      </div>
    </Link>
  );
}
