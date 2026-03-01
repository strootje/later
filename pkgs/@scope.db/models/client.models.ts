import type { GeneratedAlways, Selectable } from "kysely";

export type ClientDatabase = {
  todos: TodoItem;
};

type TodoItem = {
  id: GeneratedAlways<string>;
  title: string;
  dueAt: string;
  completedAt?: string;
};

export type SelectedTodoItem = Selectable<TodoItem>;
