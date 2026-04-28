import Image from "next/image";
import Link from "next/link";
import cn from "classnames";
import type { Article } from "@/lib/news-api-types";

type Props = {
  article: Article;
  variant?: "default" | "compact" | "feature";
};

export default function ArticleCard({ article, variant = "default" }: Props) {
  const isFeature = variant === "feature";
  const isCompact = variant === "compact";

  return (
    <Link
      href={`/articles/${article.slug}`}
      className={cn(
        "group block",
        isFeature && "md:col-span-2"
      )}
    >
      {article.image && (
        <div className={cn(
          "relative overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-900",
          isFeature ? "aspect-2/1" : "aspect-video"
        )}>
          <Image
            src={article.image}
            alt={article.title}
            fill
            sizes={isFeature ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
            className="object-cover group-hover:opacity-90 transition-opacity"
          />
        </div>
      )}
      <div className="mt-3">
        <span className="text-xs uppercase tracking-wider text-zinc-500">
          {article.category}
        </span>
        <h3 className={cn(
          "font-semibold mt-1 group-hover:underline",
          isFeature ? "text-2xl leading-tight" : isCompact ? "text-base" : "text-lg leading-snug"
        )}>
          {article.title}
        </h3>
        {!isCompact && (
          <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2 line-clamp-2">
            {article.excerpt}
          </p>
        )}
        <div className="text-xs text-zinc-500 mt-2 flex items-center gap-2">
          {article.author?.name && <span>{article.author.name}</span>}
          {article.author?.name && article.publishedAt && <span aria-hidden>·</span>}
          {article.publishedAt && (
            <time dateTime={article.publishedAt}>
              {new Date(article.publishedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </time>
          )}
        </div>
      </div>
    </Link>
  );
}
