"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import type { Category } from "@/lib/news-api-types";

type Props = {
  defaultQuery?: string;
  defaultCategory?: string;
  categories: Category[];
};

const DEBOUNCE_MS = 350;
const AUTO_SEARCH_MIN_CHARS = 3;

export default function SearchPageForm({
  defaultQuery = "",
  defaultCategory = "",
  categories,
}: Props) {
  const router = useRouter();
  const [query, setQuery] = useState(defaultQuery);
  const [category, setCategory] = useState(defaultCategory);
  const [isPending, startTransition] = useTransition();
  const lastSubmitted = useRef({ q: defaultQuery, c: defaultCategory });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function navigate(nextQ: string, nextC: string) {
    if (nextQ === lastSubmitted.current.q && nextC === lastSubmitted.current.c) {
      return;
    }
    lastSubmitted.current = { q: nextQ, c: nextC };
    const params = new URLSearchParams();
    if (nextQ) params.set("q", nextQ);
    if (nextC) params.set("category", nextC);
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `/search?${qs}` : "/search");
    });
  }

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = query.trim();
    // Auto-trigger only after the user has typed at least 3 characters,
    // or fire an empty navigation when they clear the field after a search.
    if (trimmed.length >= AUTO_SEARCH_MIN_CHARS || trimmed.length === 0) {
      debounceRef.current = setTimeout(() => {
        navigate(trimmed, category);
      }, DEBOUNCE_MS);
    }
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, category]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    navigate(query.trim(), category);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-wrap items-center gap-2">
      <input
        type="search"
        name="q"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search articles…"
        className="px-3 py-2 text-sm rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent flex-1 min-w-[200px] outline-none focus:border-zinc-500"
      />
      <select
        name="category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="px-3 py-2 text-sm rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent outline-none focus:border-zinc-500"
        aria-label="Filter by category"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>
      <button
        type="submit"
        disabled={isPending}
        aria-busy={isPending}
        className="rounded-md px-4 py-2 text-sm font-medium bg-black text-white dark:bg-white dark:text-black disabled:opacity-60 inline-flex items-center gap-1.5"
      >
        {isPending && (
          <span
            aria-hidden
            className="inline-block w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin"
          />
        )}
        Search
      </button>
    </form>
  );
}
