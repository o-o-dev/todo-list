export interface LocalTodoState {
  content?: string;
  isCompleted?: boolean;
  categoryId?: string | null;
}
export type PendingChanges = Record<string, LocalTodoState>;
export interface BatchState {
  pendingUpdates: PendingChanges;
  pendingDeletes: Set<string>;
}
