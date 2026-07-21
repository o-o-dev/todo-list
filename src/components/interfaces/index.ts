export interface LocalTodoState {
  content?: string;
  isCompleted?: boolean;
}
export type PendingChanges = Record<string, LocalTodoState>;
export interface BatchState {
  pendingUpdates: PendingChanges;
  pendingDeletes: Set<string>;
}
