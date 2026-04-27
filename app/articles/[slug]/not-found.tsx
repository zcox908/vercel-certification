import Link from "next/link";

export default function ArticleNotFound() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 text-center">
      <h1 className="text-2xl font-bold">Article not found</h1>
      <p className="text-zinc-600 dark:text-zinc-400 mt-2">
        We couldn&apos;t find that one.
      </p>
      <Link
        href="/"
        className="inline-block mt-6 text-sm underline"
      >
        Back to home
      </Link>
    </div>
  );
}
