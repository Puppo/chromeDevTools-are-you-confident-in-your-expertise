import { getTodos } from '@/api/todos';
import DevToolsShowcase from '@/components/DevToolsShowcase';
import { Todos } from '@/components/todos/Todos';
import { QUERY_KEYS } from '@/constants/api';
import { getQueryClient } from '@/providers/react-query/get-query-client';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export default async function TodosPage() {
  const queryClient = getQueryClient();
  await queryClient.prefetchQuery({
    queryKey: QUERY_KEYS.TODOS,
    queryFn: getTodos,
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Todo List with SSR
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            This page demonstrates Server-Side Rendering (SSR) with Next.js. 
            Check the Network tab in Chrome DevTools to see the initial HTML response.
          </p>
          <div className="mt-6 inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <svg className="w-5 h-5 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-blue-700 text-sm font-medium">
              SSR: Content rendered on server, then hydrated on client
            </span>
          </div>
        </div>

        <HydrationBoundary state={dehydrate(queryClient)}>
          <Todos />
        </HydrationBoundary>

        <DevToolsShowcase />
      </div>
    </div>
  );
}