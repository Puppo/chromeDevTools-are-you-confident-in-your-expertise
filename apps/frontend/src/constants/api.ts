
export const API_URL = 'http://localhost:3001/api';

type Key<TResult extends (string | number | boolean)[] = (string | number | boolean)[], TInput extends (string | number | boolean)[] = never> = TResult
  | ((...params: TInput) => TResult);

interface QueryKeys {
  [key: string]: {
    key: Key;
  } | {
    key: Key;
    nested: QueryKeys[];
  }
}

const KEY = {
  TODOS: 'todos',
}

export const QUERY_KEYS = {
  TODOS: {
    key: [KEY.TODOS],
    nested: [{
      ID: {
        key: (id: string | number | boolean) => [KEY.TODOS, id],
      }
    }]
  },
} satisfies QueryKeys;