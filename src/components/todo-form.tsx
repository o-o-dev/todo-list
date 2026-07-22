"use client";

import { useState } from "react";
import { api } from "todo/trpc/react";
import { Button } from "todo/components/ui/button";
import { Input } from "todo/components/ui/input";

export function TodoForm() {
  const utils = api.useUtils();
  const [content, setContent] = useState("");

  const createTodo = api.todo.create.useMutation({
    onSuccess: () => {
      setContent("");
      void utils.todo.getAll.invalidate();
    },
  });

  const isPending = createTodo.isPending;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const trimmed = content.trim();
    if (!trimmed) return;
    createTodo.mutate({ content: trimmed });
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="Add a new task..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={isPending}
        className="flex-1"
        maxLength={256}
        aria-label="New task content"
      />
      <Button
        type="submit"
        disabled={isPending || !content.trim()}
        size="default"
      >
        {isPending ? "Adding..." : "Add"}
      </Button>
    </form>
  );
}
