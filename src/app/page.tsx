import { getFeaturedProducts, getCategories } from "@/lib/queries";
import { ProductCard } from "@/components/product-card";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [featured, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 space-y-16">
      {/* Hero */}
      <section className="text-center space-y-4 py-16">
        <h1 className="text-5xl font-bold tracking-tight">
          cart<span className="text-blue-600">Container</span>
        </h1>
        <p className="text-lg text-zinc-500 max-w-xl mx-auto">
          Open-source ecommerce boilerplate. Browse products, add to cart, and
          checkout — all powered by Next.js.
        </p>
        <div className="flex items-center justify-center gap-3 pt-2">
          <a
            href="/products"
            className="rounded-full bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
          >
            Shop All
          </a>
          <a
            href="https://github.com/RbMo7/cartContainer"
            className="rounded-full border px-6 py-2.5 text-sm font-medium hover:bg-zinc-100 transition-colors"
          >
            View on GitHub →
          </a>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-zinc-400">
            Categories
          </h2>
          <div className="flex flex-wrap gap-2">
            {categories.map((c) => (
              <a
                key={c.id}
                href={`/products?category=${c.slug}`}
                className="rounded-full border px-4 py-1.5 text-sm hover:bg-zinc-100 transition-colors"
              >
                {c.name}
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-semibold tracking-tight">
            Featured Products
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
