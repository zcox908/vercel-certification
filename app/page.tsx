import { Suspense } from "react";
import type { Metadata } from "next";
import BreakingNewsBanner from "@/components/breaking-news";
import Trending from "@/components/trending";
import ArticleCard from "@/components/article/article-card";
import { listArticles } from "@/lib/news-api";

const homeDescription =
  "Featured stories, the latest articles, and trending news for modern web developers.";

export const metadata: Metadata = {
  description: homeDescription,
  openGraph: {
    type: "website",
    title: "Vercel Daily News",
    description: homeDescription,
    siteName: "Vercel Daily News",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vercel Daily News",
    description: homeDescription,
  },
};

async function FeaturedArticles() {
  const featuredRes = await listArticles({ featured: true, limit: 3 });
  if (!featuredRes.success || !featuredRes.data.length) return null;

  const [lead, ...rest] = featuredRes.data;

  return (
    <section>
      <h2 className="text-sm font-bold uppercase tracking-wider mb-4">
        Featured
      </h2>
      <div className="grid md:grid-cols-2 gap-6">
        <ArticleCard article={lead} variant="feature" />
        <div className="flex flex-col gap-6">
          {rest.map((a) => (
            <ArticleCard key={a.id} article={a} variant="compact" />
          ))}
        </div>
      </div>
    </section>
  );
}

async function LatestArticles() {
  const res = await listArticles({ limit: 12 });
  if (!res.success) return null;

  return (
    <section className="mt-12">
      <h2 className="text-sm font-bold uppercase tracking-wider mb-4">
        Latest
      </h2>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {res.data.map((a) => (
          <ArticleCard key={a.id} article={a} />
        ))}
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Suspense fallback={null}>
        <BreakingNewsBanner />
      </Suspense>

      <div className="max-w-5xl mx-auto px-4 py-8 grid lg:grid-cols-[1fr_280px] gap-10">
        <div>
          <Suspense fallback={<p className="text-sm text-zinc-500">Loading featured…</p>}>
            <FeaturedArticles />
          </Suspense>
          <Suspense fallback={<p className="text-sm text-zinc-500 mt-12">Loading latest…</p>}>
            <LatestArticles />
          </Suspense>
        </div>
        <Suspense fallback={null}>
          <Trending />
        </Suspense>
      </div>
    </>
  );
}
