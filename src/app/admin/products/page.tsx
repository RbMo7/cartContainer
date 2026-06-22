import { auth } from "@/lib/auth";
import { getAllProducts } from "@/lib/queries";
import { redirect } from "next/navigation";
import { updateProduct } from "@/lib/actions";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const session = await auth();
  if (session?.user?.role !== "admin") redirect("/");

  const products = await getAllProducts();

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
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
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Published</th>
              <th className="px-4 py-3 font-medium">Featured</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-zinc-50">
                <td className="px-4 py-3">
                  <p className="font-medium">{p.name}</p>
                  <p className="text-xs text-zinc-400">{p.category.name}</p>
                </td>
                <td className="px-4 py-3">${(p.price / 100).toFixed(2)}</td>
                <td className="px-4 py-3">{p.stock}</td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      p.published ? "bg-green-100 text-green-700" : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {p.published ? "Yes" : "No"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <form
                    action={async () => {
                      "use server";
                      await updateProduct(p.id, { featured: !p.featured });
                    }}
                  >
                    <button
                      type="submit"
                      className={`rounded-full px-2 py-0.5 text-xs ${
                        p.featured
                          ? "bg-amber-100 text-amber-700"
                          : "bg-zinc-100 text-zinc-500"
                      }`}
                    >
                      {p.featured ? "Featured" : "Set Featured"}
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
