'use client';

import { QueryClientProvider } from "@tanstack/react-query";
import { getQueryClient } from "./react-query/get-query-client";

interface ProviderProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProviderProps) {
  const client = getQueryClient();

  return <QueryClientProvider client={client}>
    {children}
  </QueryClientProvider>;
}