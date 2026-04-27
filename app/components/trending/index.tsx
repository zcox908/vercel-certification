import Link from "next/link";
import { getTrending } from "@/lib/news-api";

type Props = {
  exclude?: string[];
};

export default async function Trending({ exclude = [] }: Props) {
  const res = await getTrending(exclude);
  if (!res.success) return null;

  const items = res.data;
  if (!items?.length) return null;

  return (
    <aside className="border-l border-zinc-200 dark:border-zinc-800 pl-6">
      <h2 className="text-sm font-bold uppercase tracking-wider mb-4">
        Trending
      </h2>
      <ol className="flex flex-col gap-4">
        {items.map((article, i) => (
          <li key={article.id} className="flex gap-3">
            <span className="text-2xl font-bold text-zinc-300 dark:text-zinc-700 leading-none">
              {i + 1}
            </span>
            <Link
              href={`/articles/${article.slug}`}
              className="text-sm font-medium hover:underline"
            >
              {article.title}
            </Link>
          </li>
        ))}
      </ol>
    </aside>
  );
}
