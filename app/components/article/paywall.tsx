import Image from "next/image";
import Link from "next/link";
import {
  createSubscription,
  subscribe,
} from "@/actions/subscriptions";
import type { Article } from "@/lib/news-api-types";

type Props = {
  article: Article;
  hasToken: boolean;
};

export default function Paywall({ article, hasToken }: Props) {
  const published = new Date(article.publishedAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <article>
      <div className="text-xs uppercase tracking-wider text-zinc-500">
        <Link href={`/category/${article.category}`} className="hover:underline">
          {article.category}
        </Link>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mt-2 leading-tight">
        {article.title}
      </h1>
      <div className="text-sm text-zinc-600 dark:text-zinc-400 mt-3 flex gap-3">
        <span>{article.author?.name}</span>
        <span>·</span>
        <span>{published}</span>
      </div>

      {article.image && (
        <div className="relative aspect-2/1 mt-6 rounded-md overflow-hidden bg-zinc-100 dark:bg-zinc-900">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 720px"
            className="object-cover"
          />
        </div>
      )}

      <div className="relative mt-6">
        <p className="text-lg text-zinc-700 dark:text-zinc-300 leading-7">
          {article.excerpt}
        </p>
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 -bottom-4 h-32 bg-gradient-to-b from-transparent to-white dark:to-black"
        />
      </div>

      <div className="mt-8 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 md:p-8 bg-zinc-50 dark:bg-zinc-950 text-center">
        <h2 className="text-xl md:text-2xl font-bold">
          Subscribe to keep reading
        </h2>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 max-w-md mx-auto">
          {hasToken
            ? "Reactivate your subscription to read the full article and unlock all of Vercel Daily News."
            : "Become a subscriber to read the full article and unlock all of Vercel Daily News."}
        </p>
        <form action={hasToken ? subscribe : createSubscription} className="mt-5">
          <button
            type="submit"
            className="rounded-md px-5 py-2.5 text-sm font-semibold bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition-opacity"
          >
            {hasToken ? "Reactivate subscription" : "Subscribe to read"}
          </button>
        </form>
      </div>
    </article>
  );
}
