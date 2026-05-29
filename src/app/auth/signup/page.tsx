import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export default function SignUpPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-20 text-center space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">Create Account</h1>
      <form
        action={async (formData: FormData) => {
          "use server";
          const email = formData.get("email") as string;
          const password = formData.get("password") as string;
          const name = formData.get("name") as string;

          if (!email || !password) return;

          const existing = await prisma.user.findUnique({ where: { email } });
          if (existing) redirect("/auth/signin?exists=1");

          await prisma.user.create({
            data: {
              email,
              name: name || email.split("@")[0]!,
              password: await hash(password, 12),
            },
          });

          redirect("/auth/signin?created=1");
        }}
        className="space-y-4 text-left"
      >
        <input
          name="name"
          placeholder="Full name"
          className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-900"
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-900"
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          minLength={6}
          className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-900"
        />
        <button
          type="submit"
          className="w-full rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
        >
          Create Account
        </button>
        <p className="text-center text-sm text-zinc-400">
          Already have an account?{" "}
          <a href="/auth/signin" className="text-zinc-900 underline">
            Sign In
          </a>
        </p>
      </form>
    </div>
  );
}
