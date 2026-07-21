"use client";

import { api } from "todo/trpc/react";

export function TodoList() {
  const utils = api.useUtils();
  const { data, isLoading } = api.todo.getAll.useQuery();
  const todos = data ?? [];

  const toggleTodo = api.todo.toggle.useMutation({
    onSuccess: () => {
      utils.todo.getAll.invalidate();
    },
  });
  const deleteTodo = api.todo.delete.useMutation({
    onSuccess: () => {
      utils.todo.getAll.invalidate();
    },
  });

  if (isLoading) {
    return (
      <div className="text-muted-foreground py-8 text-center text-sm">
        <p>Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Task count */}
      <div className="flex items-center justify-between">
        <span className="text-muted-foreground text-sm">
          {todos.length} {todos.length === 1 ? "task" : "tasks"}
        </span>
      </div>

      {/* Todo list */}
      {todos.length > 0 ? (
        <ul className="space-y-3">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="border-border/50 bg-background/50 flex items-center gap-3 rounded-xl border p-4 transition-colors"
            >
              <button
                onClick={() => toggleTodo.mutate({ id: todo.id })}
                type="button"
                className={`size-5 rounded-full border-2 transition-colors ${
                  todo.isCompleted
                    ? "border-primary bg-primary"
                    : "border-border hover:border-primary/50"
                }`}
                aria-label={
                  todo.isCompleted
                    ? "Mark task as incomplete"
                    : "Mark task as complete"
                }
              >
                {todo.isCompleted && (
                  <svg
                    className="text-primary-foreground size-full p-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </button>

              <span
                className={`text-foreground flex-1 text-sm ${
                  todo.isCompleted ? "text-muted-foreground line-through" : ""
                }`}
              >
                {todo.content}
              </span>

              <button
                onClick={() => deleteTodo.mutate({ id: todo.id })}
                type="button"
                className="text-muted-foreground hover:text-destructive transition-colors"
                aria-label="Delete task"
              >
                <svg
                  className="size-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-muted-foreground py-8 text-center text-sm">
          <p>No tasks yet</p>
          <p className="mt-1 text-xs">Add your first task to get started</p>
        </div>
      )}
    </div>
  );
}
