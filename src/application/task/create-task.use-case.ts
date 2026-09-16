import { Injectable } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import { Task } from '../../domain/task/task';
import { TaskRepository } from '../../domain/task/task.repository';

@Injectable()
export class CreateTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(title: string): Promise<Task> {
    const task: Task = {
      id: randomUUID(),
      title,
      completed: false,
      createdAt: new Date(),
    };
    return this.taskRepository.create(task);
  }
}
