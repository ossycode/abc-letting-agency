/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { SidebarProvider } from "@/context/SidebarContext";
import { authEvents } from "@/lib/authEvents";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { useState } from "react";

function is401(err: unknown) {
  const any = err as any;
  return (
    any?.status === 401 ||
    any?.response?.status === 401 ||
    any?.cause?.status === 401
  );
}
export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // defaultOptions: {
        //   queries: {
        //     staleTime: 30_000,
        //     refetchOnWindowFocus: false,
        //   },
        // },
        defaultOptions: {
          queries: {
            // v5 signature: (failureCount, error)
            retry: (failureCount, error: any) =>
              is401(error) ? false : failureCount < 2,
          },
        },
        queryCache: new QueryCache({
          onError: (error) => {
            if (is401(error)) authEvents.emitUnauthorized();
          },
        }),
        mutationCache: new MutationCache({
          onError: (error) => {
            if (is401(error)) authEvents.emitUnauthorized();
          },
        }),
      })
  );
  return (
    <QueryClientProvider client={queryClient}>
      <SidebarProvider>{children}</SidebarProvider>
    </QueryClientProvider>
  );
}
