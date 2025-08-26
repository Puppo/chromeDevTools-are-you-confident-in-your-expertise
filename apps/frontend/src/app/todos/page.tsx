import { Suspense } from 'react';
import DevToolsShowcase from '../../components/DevToolsShowcase';
import TodoContainer from './components/TodoContainer';
import TodoSkeleton from './components/TodoSkeleton';

// This function fetches todos from the API
async function getTodos() {
  // In a real app, this would fetch from your backend
  // For demo purposes, we'll use the API route
  try {
    const response = await fetch('http://localhost:3000/api/todos', {
      cache: 'no-store', // Disable caching to always get fresh data
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch todos');
    }
    
    const data = await response.json();
    return data.todos;
  } catch (error) {
    // Fallback to default todos if API fails
    console.error('Failed to fetch todos, using fallback data:', error);
    return [
      { id: '1', text: 'Open Chrome DevTools (F12)', completed: false, createdAt: new Date().toISOString() },
      { id: '2', text: 'Go to Network tab', completed: false, createdAt: new Date().toISOString() },
      { id: '3', text: 'Monitor API requests in real-time', completed: false, createdAt: new Date().toISOString() },
      { id: '4', text: 'Check Performance tab for metrics', completed: false, createdAt: new Date().toISOString() },
      { id: '5', text: 'Use Console for debugging', completed: false, createdAt: new Date().toISOString() },
    ];
  }
}

export default async function TodosPage() {
  const initialTodos = await getTodos();

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

        <Suspense fallback={<TodoSkeleton />}>
          <TodoContainer initialTodos={initialTodos} />
        </Suspense>

        <DevToolsShowcase />
      </div>
    </div>
  );
}