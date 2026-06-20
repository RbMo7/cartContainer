import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { seedProducts } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/");

  const [productCount, orderCount, userCount] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Admin</h1>
        <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium">
          admin
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border bg-white p-5 space-y-1">
          <p className="text-2xl font-bold">{productCount}</p>
          <p className="text-xs text-zinc-400">Products</p>
        </div>
        <div className="rounded-xl border bg-white p-5 space-y-1">
          <p className="text-2xl font-bold">{orderCount}</p>
          <p className="text-xs text-zinc-400">Orders</p>
        </div>
        <div className="rounded-xl border bg-white p-5 space-y-1">
          <p className="text-2xl font-bold">{userCount}</p>
          <p className="text-xs text-zinc-400">Users</p>
        </div>
      </div>

      {productCount === 0 && (
        <form
          action={async () => {
            "use server";
            await seedProducts();
          }}
        >
          <button
            type="submit"
            className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-500 transition-colors"
          >
            Seed Sample Products
          </button>
        </form>
      )}

      <div className="flex gap-4">
        <a
          href="/admin/products"
          className="flex-1 rounded-xl border bg-white p-5 text-center text-sm font-medium hover:shadow-md transition-shadow"
        >
          Manage Products →
        </a>
        <a
          href="/admin/orders"
          className="flex-1 rounded-xl border bg-white p-5 text-center text-sm font-medium hover:shadow-md transition-shadow"
        >
          Manage Orders →
        </a>
      </div>
    </div>
  );
}
