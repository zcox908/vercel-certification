import Link from "next/link";
import { listCategories } from "@/lib/news-api";

export default async function CategoryNav() {
  const res = await listCategories();
  if (!res.success) return null;

  return (
    <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
      <Link href="/" className="font-medium hover:underline">
        Home
      </Link>
      {res.data.map((cat) => (
        <Link
          key={cat.slug}
          href={`/category/${cat.slug}`}
          className="text-zinc-700 dark:text-zinc-300 hover:underline"
        >
          {cat.name}
        </Link>
      ))}
    </nav>
  );
}
