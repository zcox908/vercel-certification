type ApiError = {
  success: false;
  error: { code: string; message: string; details?: unknown };
};

type ApiSuccess<T> = {
  success: true;
  data: T;
  meta?: { pagination: Pagination };
};

type ApiResult<T> = ApiSuccess<T> | ApiError;

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: ContentBlock[];
  category: string;
  author: Author;
  image: string;
  publishedAt: string;
  featured: boolean;
  tags: string[];
};

type ArticleCategory =
  | "changelog"
  | "engineering"
  | "customers"
  | "company-news"
  | "community";

type Author = { name: string; avatar: string };

type BreakingNews = {
  id: string;
  headline: string;
  summary: string;
  articleId: string;
  category: string;
  publishedAt: string;
  urgent: boolean;
};

type Category = {
  slug: ArticleCategory;
  name: string;
  articleCount: number;
};

type ContentBlock =
  | { type: "paragraph"; text: string }
  | { type: "heading"; level: 2 | 3; text: string }
  | { type: "blockquote"; text: string }
  | { type: "unordered-list"; items: string[] }
  | { type: "ordered-list"; items: string[] }
  | { type: "image"; src: string; alt: string; caption?: string };

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

type PublicationConfig = {
  publicationName: string;
  language: string;
  features: {
    newsletter: boolean;
    bookmarks: boolean;
    comments: boolean;
    darkMode: boolean;
    searchSuggestions: boolean;
  };
  socialLinks: {
    twitter?: string;
    github?: string;
    discord?: string;
  };
  seo: {
    defaultTitle: string;
    titleTemplate: string;
    defaultDescription: string;
  };
};

export type {
  ApiError,
  ApiSuccess,
  ApiResult,
  Article,
  ArticleCategory,
  Author,
  BreakingNews,
  Category,
  ContentBlock,
  Pagination,
  PublicationConfig,
};
