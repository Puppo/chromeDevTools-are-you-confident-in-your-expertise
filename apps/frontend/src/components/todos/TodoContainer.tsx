'use client';

import { useOptimistic, useState } from 'react';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

interface TodoContainerProps {
  todos: Todo[];
}

const TodoContainer = ({ todos }: TodoContainerProps) => {
  const [newTodoText, setNewTodoText] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  
  // Optimistic updates for better UX
  const [optimisticTodos, addOptimisticTodo] = useOptimistic(
    todos,
    (state, newTodo: Todo) => [...state, newTodo]
  );

  const addTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoText.trim()) return;

    const tempTodo: Todo = {
      id: `temp-${Date.now()}`,
      text: newTodoText.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
    };

    setIsAdding(true);
    
    // Optimistic update
    addOptimisticTodo(tempTodo);
    setNewTodoText('');

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: tempTodo.text }),
      });

      if (response.ok) {
        const data = await response.json();
        // setTodos(prev => [...prev, data.todo]);
      } else {
        // Remove optimistic update on failure
        // setTodos(prev => prev);
        console.error('Failed to add todo');
      }
    } catch (error) {
      // Remove optimistic update on failure
      // setTodos(prev => prev);
      console.error('Error adding todo:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const toggleTodo = async (id: string) => {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    setIsUpdating(id);
    
    // Optimistic update
    // setTodos(prev =>
    //   prev.map(t =>
    //     t.id === id ? { ...t, completed: !t.completed } : t
    //   )
    // );

    try {
      const response = await fetch('/api/todos', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          id, 
          completed: !todo.completed 
        }),
      });

      if (!response.ok) {
        // Revert optimistic update on failure
        // setTodos(prev =>
        //   prev.map(t =>
        //     t.id === id ? { ...t, completed: todo.completed } : t
        //   )
        // );
        console.error('Failed to update todo');
      }
    } catch (error) {
      // Revert optimistic update on failure
      // setTodos(prev =>
      //   prev.map(t =>
      //     t.id === id ? { ...t, completed: todo.completed } : t
      //   )
      // );
      console.error('Error updating todo:', error);
    } finally {
      setIsUpdating(null);
    }
  };

  const deleteTodo = async (id: string) => {
    // Optimistic update
    const originalTodos = todos;
    // setTodos(prev => prev.filter(todo => todo.id !== id));

    try {
      const response = await fetch(`/api/todos?id=${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        // Revert on failure
        // setTodos(originalTodos);
        console.error('Failed to delete todo');
      }
    } catch (error) {
      // Revert on failure
      // setTodos(originalTodos);
      console.error('Error deleting todo:', error);
    }
  };

  const completedCount = optimisticTodos.filter(todo => todo.completed).length;
  const totalCount = optimisticTodos.length;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      {/* Stats */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Your Todos</h2>
          <p className="text-gray-600 mt-1">
            {completedCount} of {totalCount} completed
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-gray-500">Progress</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-20 bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
              ></div>
            </div>
            <span className="text-sm font-medium text-gray-700">
              {totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0}%
            </span>
          </div>
        </div>
      </div>

      {/* Add Todo Form */}
      <form onSubmit={addTodo} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newTodoText}
            onChange={(e) => setNewTodoText(e.target.value)}
            placeholder="Add a new todo..."
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            disabled={isAdding}
          />
          <button
            type="submit"
            disabled={isAdding || !newTodoText.trim()}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
          >
            {isAdding ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Adding...
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Add
              </>
            )}
          </button>
        </div>
      </form>

      {/* Todo List */}
      <div className="space-y-2">
        {optimisticTodos.length === 0 ? (
          <div className="text-center py-12">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 text-lg">No todos yet</p>
            <p className="text-gray-400 text-sm mt-1">Add your first todo above!</p>
          </div>
        ) : (
          optimisticTodos.map((todo) => (
            <div
              key={todo.id}
              className={`flex items-center gap-3 p-4 rounded-lg border transition-all duration-200 ${
                todo.completed
                  ? 'bg-green-50 border-green-200'
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <button
                onClick={() => toggleTodo(todo.id)}
                disabled={isUpdating === todo.id}
                className={`flex-shrink-0 w-5 h-5 rounded border-2 transition-all duration-200 flex items-center justify-center ${
                  todo.completed
                    ? 'bg-green-500 border-green-500 text-white'
                    : 'border-gray-300 hover:border-green-400'
                } ${isUpdating === todo.id ? 'opacity-50' : ''}`}
              >
                {todo.completed && !isUpdating && (
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {isUpdating === todo.id && (
                  <div className="animate-spin rounded-full h-3 w-3 border border-white border-t-transparent"></div>
                )}
              </button>
              
              <div className="flex-1 min-w-0">
                <p className={`transition-all duration-200 ${
                  todo.completed 
                    ? 'text-green-700 line-through' 
                    : 'text-gray-900'
                }`}>
                  {todo.text}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(todo.createdAt).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-1">
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`p-2 rounded-md transition-colors ${
                    todo.completed
                      ? 'text-green-600 hover:bg-green-100'
                      : 'text-gray-400 hover:text-green-600 hover:bg-green-50'
                  }`}
                  title={todo.completed ? 'Mark as incomplete' : 'Mark as complete'}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </button>
                
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="p-2 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                  title="Delete todo"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* DevTools Tips */}
      {optimisticTodos.length > 0 && (
        <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Chrome DevTools Tips
          </h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Open DevTools (F12) and go to Network tab when adding todos</li>
            <li>• Check the Console for any JavaScript errors or logs</li>
            <li>• Use Elements tab to inspect the todo components</li>
            <li>• Performance tab shows rendering and interaction metrics</li>
          </ul>
        </div>
      )}
    </div>
  );
};

export default TodoContainer;