export default function ProductsLoading() {
  return <div className="mx-auto max-w-6xl px-4 py-8"><div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="animate-pulse rounded-xl border bg-white p-3"><div className="aspect-square rounded-lg bg-zinc-100 mb-3" /><div className="h-3 w-16 bg-zinc-100 rounded mb-2" /><div className="h-4 w-28 bg-zinc-100 rounded mb-2" /><div className="h-4 w-20 bg-zinc-100 rounded" /></div>)}</div></div>;
}
