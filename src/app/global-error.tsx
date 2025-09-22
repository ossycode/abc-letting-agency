"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, Home, RotateCcw, ArrowLeft } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  console.error("Global error:", error);

  return (
    <html>
      <body className="min-h-screen bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
        <section className="min-h-[60vh] grid place-items-center px-6 py-16">
          <div className="w-full max-w-2xl rounded-2xl border border-zinc-200/70 bg-white/70 p-8 shadow-xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
            <div className="flex items-start gap-4">
              <div className="rounded-xl bg-rose-100 p-3 text-rose-700 ring-1 ring-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:ring-rose-800/60">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Unexpected error
                </h1>
                <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
                  The app failed to load. You can try reloading, going back, or
                  returning home.
                </p>

                <div className="mt-6 flex flex-wrap gap-2">
                  <button
                    onClick={() => reset()}
                    className="inline-flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white transition hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black dark:bg-white dark:text-black dark:hover:bg-white/90 dark:focus:ring-white"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Reload
                  </button>

                  <button
                    onClick={() => router.back()}
                    className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:focus:ring-zinc-700"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Go back
                  </button>

                  <Link
                    href="/"
                    className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-semibold text-zinc-900 transition hover:bg-zinc-200 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 dark:focus:ring-zinc-700"
                  >
                    <Home className="h-4 w-4" />
                    Home
                  </Link>
                </div>

                {error?.digest && (
                  <p className="mt-4 text-xs text-zinc-500 dark:text-zinc-400">
                    Error ID: <span className="font-mono">{error.digest}</span>
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}
