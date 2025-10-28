import { type Todo } from '@devtools-demo/api';
import type { PostgresDb } from '@fastify/postgres';
import SQL from '@nearform/sql';
import { NotFoundError } from '../../errors/not-found-error.js';

interface TodoTable {
  id: string;
  text: string;
  completed: boolean;
  created_at: Date;
  updated_at: Date;
}

export function todoService(pg: PostgresDb) {

  function mapTodo(row: TodoTable | undefined): null;
  function mapTodo(row: TodoTable): Todo;
  function mapTodo(row: TodoTable | undefined): Todo | null {
    if (!row) return null;
    return {
      id: row.id,
      text: row.text,
      completed: row.completed,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  async function getTodos(): Promise<Todo[]> {
    const result = await pg.query<TodoTable>(SQL`
    SELECT
      id,
      text,
      completed,
      created_at,
      updated_at
    FROM todos
    ORDER BY created_at ASC`);
    return result.rows.map(mapTodo);
  }

  async function getTodoById(id: number): Promise<Todo | null> {
    const result = await pg.query<TodoTable>(SQL`
    SELECT
      id,
      text,
      completed,
      created_at,
      updated_at
    FROM todos
    WHERE id = ${id}`);
    return mapTodo(result.rows[0]);
  }

  async function createTodo({
    text,
    completed
  }: Pick<TodoTable, 'text' | 'completed'>): Promise<Todo> {
    const result = await pg.query<TodoTable>(SQL`INSERT INTO todos (text, completed) VALUES (${text}, ${completed}) RETURNING id, text, completed, created_at, updated_at`);
    const todo = mapTodo(result.rows[0]);
    if (!todo) {
      throw new Error('Failed to create todo');
    }
    return todo;
  }

  async function deleteTodo(id: TodoTable['id']): Promise<void> {
    const result = await pg.query(SQL`DELETE FROM todos WHERE id = ${id}`);
    if (result.rowCount === 0) {
      throw new NotFoundError(`Todo with id ${id} not found`);
    }
  }

  async function updateTodo(id: TodoTable['id'], data: Partial<Pick<TodoTable, 'text' | 'completed'>>): Promise<Todo | null> {
    const fields = Object.entries(data).reduce((acc, [key, value]) => {
      if (value === undefined) return acc;
      acc.push(SQL`${SQL.quoteIdent(key)} = ${value}`);
      return acc;
    }, [] as SQL.SqlStatement[]);
    if (fields.length === 0) {
      throw new Error('No fields to update');
    }
    const result = await pg.query<TodoTable>(SQL`UPDATE todos SET ${SQL.glue(fields, ', ')}, updated_at = NOW() WHERE id = ${id} RETURNING id, text, completed, created_at, updated_at`);
    return mapTodo(result.rows[0]);
  }

  return {
    getTodos,
    getTodoById,
    createTodo,
    deleteTodo,
    updateTodo,
  };
}
