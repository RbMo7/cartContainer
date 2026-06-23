import { auth } from "@/lib/auth";
import { getAllOrders } from "@/lib/queries";
import { redirect } from "next/navigation";
import { updateOrderStatus } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/");

  const orders = await getAllOrders();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
        <a
          href="/admin"
          className="text-sm text-zinc-400 hover:text-zinc-900 transition-colors"
        >
          ← Back
        </a>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-zinc-50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Order</th>
              <th className="px-4 py-3 font-medium">Customer</th>
              <th className="px-4 py-3 font-medium">Total</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3 font-mono text-xs">
                  #{order.id.slice(0, 8)}
                </td>
                <td className="px-4 py-3">
                  {order.user.email}
                </td>
                <td className="px-4 py-3 font-medium">
                  ${(order.total / 100).toFixed(2)}
                </td>
                <td className="px-4 py-3 text-xs text-zinc-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      order.status === "delivered"
                        ? "bg-green-100 text-green-700"
                        : order.status === "paid"
                          ? "bg-blue-100 text-blue-700"
                          : order.status === "shipped"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-zinc-100 text-zinc-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <form
                    action={async () => {
                      "use server";
                      const nextStatus =
                        order.status === "pending"
                          ? "paid"
                          : order.status === "paid"
                            ? "shipped"
                            : order.status === "shipped"
                              ? "delivered"
                              : "delivered";
                      await updateOrderStatus(order.id, nextStatus);
                    }}
                  >
                    <button
                      type="submit"
                      disabled={order.status === "delivered"}
                      className="rounded-full bg-zinc-900 px-3 py-1 text-xs text-white hover:bg-zinc-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                    >
                      Next
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
