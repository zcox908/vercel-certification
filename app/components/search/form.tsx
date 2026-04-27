type Props = {
  defaultValue?: string;
};

export default function SearchForm({ defaultValue = "" }: Props) {
  return (
    <form action="/search" method="get" className="flex items-center gap-2">
      <input
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="Search articles…"
        className="px-3 py-1.5 text-sm rounded-md border border-zinc-300 dark:border-zinc-700 bg-transparent w-40 focus:w-60 transition-all outline-none focus:border-zinc-500"
      />
    </form>
  );
}
