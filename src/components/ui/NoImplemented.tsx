"use client";

import { AlertCircle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function NotImplemented() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center text-center ">
      <AlertCircle className="text-yellow-500 mb-4" width={58} height={58} />

      <h2 className="text-2xl font-semibold mb-2">Feature Not Implemented</h2>
      <p className="text-muted-foreground mb-6">
        This page or feature hasn&apos;t been built yet. Stay tuned!
      </p>

      <div className="flex gap-4">
        <button
          onClick={() => router.back()}
          className="px-4 py-2 rounded-xl bg-gray-200 hover:bg-gray-300 dark:text-gray-800 text-sm font-medium transition"
        >
          Go Back
        </button>
        <Link href={`/`}>
          <button
            className="px-4 py-2   bg-primary-accent rounded-lg
     hover:bg-transparent hover:border-link-hover hover:text-link-hover bg-gray-200 text-gray-800 dark:bg-slate-50 text-sm font-medium transition"
          >
            Home Page
          </button>
        </Link>
      </div>
    </div>
  );
}
