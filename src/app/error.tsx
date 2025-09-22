"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, Home, RotateCcw, ArrowLeft, Info } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <section className="min-h-[60vh] grid place-items-center px-6 py-16 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900">
      <div className="w-full max-w-2xl rounded-2xl border border-zinc-200/70 bg-white/70 p-8 shadow-xl backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-amber-100 p-3 text-amber-700 ring-1 ring-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:ring-amber-800/60">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Something went wrong
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-300">
              Try the action again or go back. If the problem persists, return
              to the homepage.
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              <button
                onClick={() => reset()}
                className="inline-flex items-center gap-2 rounded-lg bg-black px-3 py-2 text-sm font-semibold text-white transition hover:bg-black/90 focus:outline-none focus:ring-2 focus:ring-black dark:bg-white dark:text-black dark:hover:bg-white/90 dark:focus:ring-white"
              >
                <RotateCcw className="h-4 w-4" />
                Try again
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

            <button
              onClick={() => setShowDetails((s) => !s)}
              className="mt-6 inline-flex items-center gap-2 text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
            >
              <Info className="h-4 w-4" />
              {showDetails ? "Hide details" : "Show details"}
            </button>

            {showDetails && (
              <pre className="mt-3 max-h-64 overflow-auto rounded-lg bg-zinc-950/90 p-3 text-xs text-zinc-200 ring-1 ring-zinc-800">
                {error?.message || "Unknown error"}
                {error?.digest ? `\n\nDigest: ${error.digest}` : ""}
              </pre>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
