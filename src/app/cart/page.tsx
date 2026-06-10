import { auth } from "@/lib/auth";
import { getCart } from "@/lib/queries";
import { redirect } from "next/navigation";
import { updateCartItem, removeFromCart, createCheckoutSession } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function CartPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const cart = await getCart(session.user.id);
  const items = cart?.items ?? [];
  const subtotal = items.reduce(
    (s, i) => s + i.product.price * i.quantity,
    0,
  );

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">Shopping Cart</h1>

      {items.length === 0 ? (
        <div className="py-20 text-center text-zinc-400 space-y-4">
          <p>Your cart is empty</p>
          <a
            href="/products"
            className="inline-block rounded-full bg-zinc-900 px-6 py-2 text-sm text-white hover:bg-zinc-700 transition-colors"
          >
            Browse Products
          </a>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-xl border bg-white p-4"
              >
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-zinc-100">
                  {item.product.image ? (
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-xs text-zinc-300">
                      No img
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <a
                    href={`/products/${item.product.slug}`}
                    className="font-medium text-sm hover:underline"
                  >
                    {item.product.name}
                  </a>
                  <p className="text-sm text-zinc-500">
                    ${(item.product.price / 100).toFixed(2)} each
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <form
                    action={async () => {
                      "use server";
                      await updateCartItem(item.id, item.quantity - 1);
                    }}
                  >
                    <button
                      type="submit"
                      className="h-8 w-8 rounded-full border text-sm hover:bg-zinc-100 transition-colors"
                    >
                      −
                    </button>
                  </form>
                  <span className="w-8 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <form
                    action={async () => {
                      "use server";
                      await updateCartItem(item.id, item.quantity + 1);
                    }}
                  >
                    <button
                      type="submit"
                      className="h-8 w-8 rounded-full border text-sm hover:bg-zinc-100 transition-colors"
                    >
                      +
                    </button>
                  </form>
                </div>
                <p className="w-20 text-right font-medium text-sm">
                  ${((item.product.price * item.quantity) / 100).toFixed(2)}
                </p>
                <form
                  action={async () => {
                    "use server";
                    await removeFromCart(item.id);
                  }}
                >
                  <button
                    type="submit"
                    className="text-xs text-zinc-400 hover:text-red-500 transition-colors"
                  >
                    Remove
                  </button>
                </form>
              </div>
            ))}
          </div>

          <div className="rounded-xl border bg-white p-6 space-y-4">
            <div className="flex items-center justify-between text-lg font-semibold">
              <span>Subtotal</span>
              <span>${(subtotal / 100).toFixed(2)}</span>
            </div>
            <p className="text-xs text-zinc-400">
              Shipping calculated at checkout
            </p>
            <form
              action={async () => {
                "use server";
                const result = await createCheckoutSession();
                if (result.url) redirect(result.url);
              }}
            >
              <button
                type="submit"
                className="w-full rounded-xl bg-zinc-900 px-6 py-3 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
              >
                Proceed to Checkout
              </button>
            </form>
          </div>
        </>
      )}
    </div>
  );
}
