import { auth, signIn } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function SignInPage() {
  const session = await auth();
  if (session?.user) redirect("/");

  return (
    <div className="mx-auto max-w-sm px-4 py-20 text-center space-y-8">
      <h1 className="text-2xl font-semibold tracking-tight">Sign In</h1>
      <div className="space-y-4">
        <form
          action={async (formData: FormData) => {
            "use server";
            try {
              await signIn("credentials", formData);
            } catch (e) {
              if ((e as Error)?.name === "RedirectError") throw e;
              redirect("/auth/signin?error=1");
            }
          }}
          className="space-y-4"
        >
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
            className="w-full rounded-xl border px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-zinc-900"
          />
          <button
            type="submit"
            className="w-full rounded-xl bg-zinc-900 px-6 py-2.5 text-sm font-medium text-white hover:bg-zinc-700 transition-colors"
          >
            Sign In
          </button>
        </form>
        <p className="text-sm text-zinc-400">
          Don&apos;t have an account?{" "}
          <a href="/auth/signup" className="text-zinc-900 underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
