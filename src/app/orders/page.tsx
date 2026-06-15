import { auth } from "@/lib/auth";
import { getOrders } from "@/lib/queries";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OrdersPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const orders = await getOrders(session.user.id);

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">Order History</h1>

      {orders.length === 0 ? (
        <div className="py-20 text-center text-zinc-400">
          <p>No orders yet</p>
          <a
            href="/products"
            className="inline-block mt-4 rounded-full bg-zinc-900 px-6 py-2 text-sm text-white hover:bg-zinc-700 transition-colors"
          >
            Start Shopping
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <a
              key={order.id}
              href={`/orders/${order.id}`}
              className="block rounded-xl border bg-white p-5 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-zinc-400 font-mono">
                  #{order.id.slice(0, 8)}
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    order.status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : order.status === "paid"
                        ? "bg-blue-100 text-blue-700"
                        : "bg-zinc-100 text-zinc-600"
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="font-semibold">
                  ${(order.total / 100).toFixed(2)}
                </span>
              </div>
              <p className="mt-1 text-xs text-zinc-400">
                {order.items.length} item{order.items.length !== 1 ? "s" : ""}
              </p>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
