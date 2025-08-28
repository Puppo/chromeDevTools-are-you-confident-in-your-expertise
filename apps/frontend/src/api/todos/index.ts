import { API_URL } from "@/constants/api";
import { Todo } from "@devtools-demo/api";

export const getTodos = async (): Promise<Todo[]> => {
  const response = await fetch(`${API_URL}/todos`, {
    cache: 'no-store', // Disable caching to always get fresh data
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }

  return await response.json();
};

export const createTodo = async (text: string): Promise<Todo> => {
  const response = await fetch(`${API_URL}/todos`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ text, completed: false }),
  });

  if (!response.ok) {
    throw new Error('Failed to create todo');
  }

  return await response.json();
};

export const deleteTodo = async (id: string): Promise<void> => {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) {
    throw new Error('Failed to delete todo');
  }
};

export const patchTodo = async (id: string, data: Partial<Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Todo> => {
  const response = await fetch(`${API_URL}/todos/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to update todo');
  }

  return await response.json();
};