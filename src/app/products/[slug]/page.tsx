import { getProduct } from "@/lib/queries";
import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { addToCart } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const session = await auth();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid md:grid-cols-2 gap-12">
        {/* Image */}
        <div className="aspect-square overflow-hidden rounded-2xl bg-zinc-100">
          {product.image ? (
            <img
              src={product.image}
              alt={product.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-zinc-300">
              No image
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6 pt-4">
          <div>
            <p className="text-sm text-zinc-400 uppercase tracking-wide mb-1">
              {product.category.name}
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              {product.name}
            </h1>
          </div>

          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">
              ${(product.price / 100).toFixed(2)}
            </span>
            {product.compareAt && product.compareAt > product.price && (
              <span className="text-lg text-zinc-400 line-through">
                ${(product.compareAt / 100).toFixed(2)}
              </span>
            )}
          </div>

          <p className="leading-relaxed text-zinc-600">
            {product.description}
          </p>

          {product.stock > 0 ? (
            <p className="text-sm text-green-600">
              In stock ({product.stock} available)
            </p>
          ) : (
            <p className="text-sm text-red-500">Out of stock</p>
          )}

          {session?.user ? (
            <form
              action={async () => {
                "use server";
                await addToCart(product.id);
              }}
            >
              <button
                type="submit"
                disabled={product.stock === 0}
                className="w-full rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {product.stock === 0 ? "Out of Stock" : "Add to Cart"}
              </button>
            </form>
          ) : (
            <a
              href="/auth/signin"
              className="block w-full rounded-xl bg-zinc-900 px-6 py-3 text-center text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
            >
              Sign in to Purchase
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
