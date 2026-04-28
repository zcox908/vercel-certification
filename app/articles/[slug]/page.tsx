import { Suspense } from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import ContentBlocks from "@/components/article/content-blocks";
import Paywall from "@/components/article/paywall";
import Trending from "@/components/trending";
import { getArticle } from "@/lib/news-api";
import { getSubscription } from "@/actions/subscriptions";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const res = await getArticle(slug);
  if (!res.success) return { title: "Article" };
  const article = res.data;
  const url = `/articles/${article.slug}`;
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      url,
      siteName: "Vercel Daily News",
      publishedTime: article.publishedAt,
      authors: article.author?.name ? [article.author.name] : undefined,
      tags: article.tags,
      images: article.image ? [{ url: article.image, alt: article.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.excerpt,
      images: article.image ? [article.image] : undefined,
    },
  };
}

async function ArticleBody({ params }: { params: Params }) {
  const { slug } = await params;
  const [res, sub] = await Promise.all([getArticle(slug), getSubscription()]);

  if (!res.success) {
    if (res.error.code === "NOT_FOUND") notFound();
    return (
      <p className="text-red-600 text-sm">
        {res.error.code}: {res.error.message}
      </p>
    );
  }

  const article = res.data;
  const isSubscribed = sub?.success === true && sub.data.status === "active";

  if (!isSubscribed) {
    return <Paywall article={article} hasToken={sub !== null} />;
  }

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

      <p className="text-lg text-zinc-700 dark:text-zinc-300 mt-6 leading-7">
        {article.excerpt}
      </p>

      <div className="mt-8">
        <ContentBlocks blocks={article.content} />
      </div>

      {article.tags?.length > 0 && (
        <div className="mt-10 flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 rounded bg-zinc-100 dark:bg-zinc-900"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
}

async function ArticleSidebar({ params }: { params: Params }) {
  const { slug } = await params;
  const res = await getArticle(slug);
  const exclude = res.success ? [res.data.id] : [];
  return <Trending exclude={exclude} />;
}

export default function ArticlePage({ params }: { params: Params }) {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid lg:grid-cols-[1fr_280px] gap-10">
      <Suspense fallback={<p className="text-sm text-zinc-500">Loading article…</p>}>
        <ArticleBody params={params} />
      </Suspense>
      <Suspense fallback={null}>
        <ArticleSidebar params={params} />
      </Suspense>
    </div>
  );
}
