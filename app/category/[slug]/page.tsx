import { Suspense } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import ArticleCard from "@/components/article/article-card";
import { listArticles, listCategories } from "@/lib/news-api";
import type { ArticleCategory } from "@/lib/news-api-types";

const VALID_CATEGORIES: ArticleCategory[] = [
  "changelog",
  "engineering",
  "customers",
  "company-news",
  "community",
];

type Params = Promise<{ slug: string }>;
type Search = Promise<{ page?: string }>;

function isValidCategory(s: string): s is ArticleCategory {
  return (VALID_CATEGORIES as string[]).includes(s);
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  return { title: slug };
}

async function CategoryHeader({ params }: { params: Params }) {
  const { slug } = await params;
  if (!isValidCategory(slug)) notFound();
  const categoriesRes = await listCategories();
  const meta = categoriesRes.success
    ? categoriesRes.data.find((c) => c.slug === slug)
    : null;

  return (
    <header className="mb-8">
      <h1 className="text-3xl font-bold capitalize">
        {meta?.name ?? slug.replace("-", " ")}
      </h1>
      {meta && (
        <p className="text-sm text-zinc-500 mt-1">
          {meta.articleCount} article{meta.articleCount === 1 ? "" : "s"}
        </p>
      )}
    </header>
  );
}

async function CategoryArticles({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Search;
}) {
  const { slug } = await params;
  if (!isValidCategory(slug)) notFound();

  const { page: pageStr } = await searchParams;
  const page = Math.max(1, Number(pageStr) || 1);
  const pageSize = 12;

  const res = await listArticles({ category: slug, page, limit: pageSize });

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
        No articles in this category yet.
      </p>
    );
  }

  const pagination = res.meta?.pagination;

  return (
    <>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {res.data.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>

      {pagination && pagination.totalPages > 1 && (
        <nav className="flex items-center justify-between mt-10 text-sm">
          {pagination.hasPreviousPage ? (
            <Link
              href={`/category/${slug}?page=${page - 1}`}
              className="hover:underline"
            >
              ← Previous
            </Link>
          ) : (
            <span />
          )}
          <span className="text-zinc-500">
            Page {pagination.page} of {pagination.totalPages}
          </span>
          {pagination.hasNextPage ? (
            <Link
              href={`/category/${slug}?page=${page + 1}`}
              className="hover:underline"
            >
              Next →
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </>
  );
}

export default function CategoryPage({
  params,
  searchParams,
}: {
  params: Params;
  searchParams: Search;
}) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <Suspense fallback={<div className="mb-8 h-12" />}>
        <CategoryHeader params={params} />
      </Suspense>
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
        <CategoryArticles params={params} searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
