'use client';

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { getQueryClient } from "./react-query/get-query-client";

interface ProviderProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProviderProps) {
  const client = getQueryClient();

  return (
    <QueryClientProvider client={client}>
      <ReactQueryStreamedHydration>
        {children}
      </ReactQueryStreamedHydration>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}