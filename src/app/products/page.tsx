import { getProducts, getCategories } from "@/lib/queries";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  const filtered = category
    ? products.filter((p) => p.category.slug === category)
    : products;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        <p className="text-sm text-zinc-400">{filtered.length} items</p>
      </div>

      <div className="flex flex-wrap gap-2 pb-2">
        <a
          href="/products"
          className={`rounded-full border px-3 py-1 text-xs transition-colors ${!category ? "bg-zinc-900 text-white border-zinc-900" : "hover:bg-zinc-100"}`}
        >
          All
        </a>
        {categories.map((c) => (
          <a
            key={c.id}
            href={`/products?category=${c.slug}`}
            className={`rounded-full border px-3 py-1 text-xs transition-colors ${category === c.slug ? "bg-zinc-900 text-white border-zinc-900" : "hover:bg-zinc-100"}`}
          >
            {c.name}
          </a>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="py-20 text-center text-zinc-400">
          No products found.
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}
