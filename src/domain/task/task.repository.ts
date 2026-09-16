import type { Task } from './task';

export abstract class TaskRepository {
  abstract create(task: Task): Promise<Task>;
  abstract findById(id: string): Promise<Task | null>;
  abstract findAll(): Promise<Task[]>;
}
