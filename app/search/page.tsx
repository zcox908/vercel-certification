import { Suspense } from "react";
import type { Metadata } from "next";
import ArticleCard from "@/components/article/article-card";
import SearchForm from "@/components/search/form";
import { listArticles } from "@/lib/news-api";

type Search = Promise<{ q?: string }>;

export const metadata: Metadata = { title: "Search" };

async function SearchHeader({ searchParams }: { searchParams: Search }) {
  const { q = "" } = await searchParams;
  return (
    <div className="mt-4">
      <SearchForm defaultValue={q.trim()} />
    </div>
  );
}

async function Results({ searchParams }: { searchParams: Search }) {
  const { q = "" } = await searchParams;
  const trimmed = q.trim();

  if (trimmed === "") {
    return (
      <p className="text-zinc-600 dark:text-zinc-400">
        Enter a query to search articles.
      </p>
    );
  }

  const res = await listArticles({ search: trimmed, limit: 24 });
  if (!res.success) {
    return (
      <p className="text-red-600 text-sm">
        {res.error.code}: {res.error.message}
      </p>
    );
  }

  if (res.data.length === 0) {
    return (
      <p className="text-zinc-600 dark:text-zinc-400">
        No results for &ldquo;{trimmed}&rdquo;.
      </p>
    );
  }

  return (
    <>
      <p className="text-sm text-zinc-500 mb-6">
        {res.meta?.pagination?.total ?? res.data.length} result
        {res.data.length === 1 ? "" : "s"} for &ldquo;{trimmed}&rdquo;
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {res.data.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </>
  );
}

export default function SearchPage({
  searchParams,
}: {
  searchParams: Search;
}) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold">Search</h1>
        <Suspense fallback={<div className="mt-4"><SearchForm /></div>}>
          <SearchHeader searchParams={searchParams} />
        </Suspense>
      </header>
      <Suspense fallback={<p className="text-sm text-zinc-500">Searching…</p>}>
        <Results searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
