import Link from "next/link";
import { Suspense } from "react";
import CategoryNav from "@/components/categories/nav";
import SearchForm from "@/components/search/form";
import Subscription from "@/components/subscription";

export function Header() {
  return (
    <header className="border-b border-zinc-200 dark:border-zinc-800">
      <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
        <Link href="/" className="font-bold text-lg tracking-tight">
          Vercel Daily News
        </Link>
        <div className="flex items-center gap-4">
          <SearchForm />
          <Suspense fallback={null}>
            <Subscription />
          </Suspense>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 pb-3">
        <Suspense fallback={<span className="text-xs text-zinc-500">loading nav…</span>}>
          <CategoryNav />
        </Suspense>
      </div>
    </header>
  );
}
