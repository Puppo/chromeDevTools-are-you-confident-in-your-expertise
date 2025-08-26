import { API_URL } from "@/constants/api";

export const getTodos = async () => {
  const response = await fetch(`${API_URL}/todos`, {
    cache: 'no-store', // Disable caching to always get fresh data
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch todos');
  }

  return await response.json();
};