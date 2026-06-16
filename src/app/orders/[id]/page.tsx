import { auth } from "@/lib/auth";
import { getOrder } from "@/lib/queries";
import { notFound, redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/signin");

  const order = await getOrder(id);
  if (!order || order.userId !== session.user.id) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Order #{order.id.slice(0, 8)}
          </h1>
          <p className="text-sm text-zinc-400">
            Placed{" "}
            {new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-sm font-medium ${
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

      <div className="rounded-xl border bg-white">
        <div className="divide-y">
          {order.items.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4"
            >
              <div className="flex-1">
                <p className="font-medium text-sm">{item.product.name}</p>
                <p className="text-sm text-zinc-400">
                  ${(item.price / 100).toFixed(2)} × {item.quantity}
                </p>
              </div>
              <p className="font-medium text-sm">
                ${((item.price * item.quantity) / 100).toFixed(2)}
              </p>
            </div>
          ))}
        </div>
        <div className="border-t p-4 flex items-center justify-between font-semibold">
          <span>Total</span>
          <span>${(order.total / 100).toFixed(2)}</span>
        </div>
      </div>

      <a
        href="/orders"
        className="inline-block text-sm text-zinc-400 hover:text-zinc-900 transition-colors"
      >
        ← Back to Orders
      </a>
    </div>
  );
}
