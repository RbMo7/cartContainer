import type { Product, Category } from "@prisma/client";

type ProductWithCat = Product & { category: Category };

export function ProductCard({ product }: { product: ProductWithCat }) {
  return (
    <a
      href={`/products/${product.slug}`}
      className="group rounded-xl border bg-white p-3 transition-all hover:shadow-lg hover:-translate-y-0.5"
    >
      <div className="aspect-square overflow-hidden rounded-lg bg-zinc-100 mb-3">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="h-full w-full object-cover transition-transform group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-zinc-300 text-sm">
            No image
          </div>
        )}
      </div>
      <div className="space-y-1 px-1">
        <p className="text-xs text-zinc-400 uppercase tracking-wide">
          {product.category.name}
        </p>
        <h3 className="font-medium text-sm leading-tight">{product.name}</h3>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">
            ${(product.price / 100).toFixed(2)}
          </span>
          {product.compareAt && product.compareAt > product.price && (
            <span className="text-xs text-zinc-400 line-through">
              ${(product.compareAt / 100).toFixed(2)}
            </span>
          )}
        </div>
        {product.stock < 10 && product.stock > 0 && (
          <p className="text-xs text-amber-600">Only {product.stock} left</p>
        )}
        {product.stock === 0 && (
          <p className="text-xs text-red-500">Out of stock</p>
        )}
      </div>
    </a>
  );
}
