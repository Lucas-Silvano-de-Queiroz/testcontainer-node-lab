import { Injectable } from '@nestjs/common';
import { Task } from '../../domain/task/task';
import { TaskRepository } from '../../domain/task/task.repository';

@Injectable()
export class ListTasksUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(): Promise<Task[]> {
    return this.taskRepository.findAll();
  }
}
