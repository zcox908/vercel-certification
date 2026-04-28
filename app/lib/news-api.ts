import { cacheTag, cacheLife } from "next/cache";
import type {
  ApiResult,
  Article,
  ArticleCategory,
  BreakingNews,
  Category,
  PublicationConfig,
} from "@/lib/news-api-types";

const BASE = process.env.DAILY_NEWS_API_BASEURL;
const BYPASS = process.env.VERCEL_PROTECTION_BYPASS;

// Plain request fn — used by the subscription server actions that can't use "use cache" (cookies + write-side).
export async function newsReq(path: string, init?: RequestInit) {
  if (!BASE || !BYPASS) {
    throw new Error("newsReq: Required environmental variables not set.");
  }
  return fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "x-vercel-protection-bypass": BYPASS,
      ...init?.headers,
    },
  });
}

async function newsJson<T>(
  path: string,
  init: RequestInit = {}
): Promise<ApiResult<T>> {
  try {
    const res = await newsReq(path, init);
    try {
      return (await res.json()) as ApiResult<T>;
    } catch {
      return {
        success: false,
        error: {
          code: String(res.status),
          message: res.statusText || "Invalid JSON response",
        },
      };
    }
  } catch (e) {
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: e instanceof Error ? e.message : String(e),
      },
    };
  }
}

export type ArticleQuery = {
  page?: number;
  limit?: number;
  category?: ArticleCategory;
  search?: string;
  featured?: boolean;
};

export async function listArticles(q: ArticleQuery = {}) {
  "use cache";
  cacheTag("articles");
  if (q.category) cacheTag(`articles:${q.category}`);
  cacheLife("hours");

  const params = new URLSearchParams();
  if (q.page) params.set("page", String(q.page));
  if (q.limit) params.set("limit", String(q.limit));
  if (q.category) params.set("category", q.category);
  if (q.search) params.set("search", q.search);
  if (q.featured !== undefined) params.set("featured", String(q.featured));
  const qs = params.toString();
  return newsJson<Article[]>(`/articles${qs ? `?${qs}` : ""}`);
}

// Throwing the error inside a "use cache" so transient API errors aren't cached for hour
async function fetchArticleCached(idOrSlug: string): Promise<Article> {
  "use cache";
  cacheTag(`article:${idOrSlug}`);
  cacheLife("hours");
  const res = await newsJson<Article>(`/articles/${idOrSlug}`);
  if (!res.success) throw new Error(res.error.message, { cause: res.error });
  return res.data;
}

export async function getArticle(idOrSlug: string): Promise<ApiResult<Article>> {
  try {
    const data = await fetchArticleCached(idOrSlug);
    return { success: true, data };
  } catch (e) {
    const cause = e instanceof Error ? e.cause : null;
    if (cause && typeof cause === "object" && "code" in cause && "message" in cause) {
      return {
        success: false,
        error: cause as { code: string; message: string; details?: unknown },
      };
    }
    return {
      success: false,
      error: {
        code: "NETWORK_ERROR",
        message: e instanceof Error ? e.message : String(e),
      },
    };
  }
}

// trending is randomized every request — expect to be frequently updated
export async function getTrending(exclude: string[] = []) {
  "use cache";
  cacheTag("trending");
  cacheLife("minutes");
  const qs = exclude.length ? `?exclude=${exclude.join(",")}` : "";
  return newsJson<Article[]>(`/articles/trending${qs}`);
}

export async function listCategories() {
  "use cache";
  cacheTag("categories");
  cacheLife("days");
  return newsJson<Category[]>("/categories");
}

// breaking news randomizes per request — same logic as trending
export async function getBreakingNews() {
  "use cache";
  cacheTag("breaking-news");
  cacheLife("minutes");
  return newsJson<BreakingNews>("/breaking-news");
}

export async function getPublicationConfig() {
  "use cache";
  cacheTag("publication-config");
  cacheLife("days");
  return newsJson<PublicationConfig>("/publication/config");
}
