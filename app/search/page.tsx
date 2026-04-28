import { Suspense } from "react";
import type { Metadata } from "next";
import ArticleCard from "@/components/article/article-card";
import SearchPageForm from "@/components/search/page-form";
import { listArticles, listCategories } from "@/lib/news-api";
import type { ArticleCategory } from "@/lib/news-api-types";

type Search = Promise<{ q?: string; category?: string }>;

const VALID_CATEGORIES: ArticleCategory[] = [
  "changelog",
  "engineering",
  "customers",
  "company-news",
  "community",
];

function isValidCategory(s: string): s is ArticleCategory {
  return (VALID_CATEGORIES as string[]).includes(s);
}

export const metadata: Metadata = {
  title: "Search",
  description: "Search articles across Vercel Daily News.",
  openGraph: {
    type: "website",
    title: "Search | Vercel Daily News",
    description: "Search articles across Vercel Daily News.",
    siteName: "Vercel Daily News",
    url: "/search",
  },
  twitter: {
    card: "summary",
    title: "Search | Vercel Daily News",
    description: "Search articles across Vercel Daily News.",
  },
};

async function SearchHeader({ searchParams }: { searchParams: Search }) {
  const { q = "", category = "" } = await searchParams;
  const categoriesRes = await listCategories();
  const categories = categoriesRes.success ? categoriesRes.data : [];
  return (
    <div className="mt-4">
      <SearchPageForm
        defaultQuery={q.trim()}
        defaultCategory={category}
        categories={categories}
      />
    </div>
  );
}

async function Results({ searchParams }: { searchParams: Search }) {
  const { q = "", category = "" } = await searchParams;
  const trimmed = q.trim();
  const cat = isValidCategory(category) ? category : undefined;
  const isDefault = trimmed === "" && !cat;

  const res = await listArticles(
    isDefault
      ? { limit: 12 }
      : { search: trimmed || undefined, category: cat, limit: 24 }
  );

  if (!res.success) {
    return (
      <p className="text-red-600 text-sm">
        {res.error.code}: {res.error.message}
      </p>
    );
  }

  if (isDefault) {
    return (
      <>
        <p className="text-sm text-zinc-500 mb-6">
          Recent articles — start typing to search.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {res.data.map((a) => (
            <ArticleCard key={a.id} article={a} />
          ))}
        </div>
      </>
    );
  }

  if (res.data.length === 0) {
    return (
      <p className="text-zinc-600 dark:text-zinc-400">
        No results{trimmed && <> for &ldquo;{trimmed}&rdquo;</>}
        {cat && <> in {cat}</>}.
      </p>
    );
  }

  const total = res.meta?.pagination?.total ?? res.data.length;

  return (
    <>
      <p className="text-sm text-zinc-500 mb-6">
        {total} result{total === 1 ? "" : "s"}
        {trimmed && <> for &ldquo;{trimmed}&rdquo;</>}
        {cat && <> in {cat}</>}
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
        <Suspense fallback={<div className="mt-4 h-10" />}>
          <SearchHeader searchParams={searchParams} />
        </Suspense>
      </header>
      <Suspense fallback={<p className="text-sm text-zinc-500">Searching…</p>}>
        <Results searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
