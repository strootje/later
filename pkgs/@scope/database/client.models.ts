import type { GeneratedAlways } from "kysely";

export type ClientDatabase = {
  todos: Todo;
};

type Todo = {
  id: GeneratedAlways<string>;
  title: string;
  dueAt: string;
  completedAt?: string;
};
