import { Injectable } from '@nestjs/common';
import { Task } from '../../domain/task/task';
import { TaskRepository } from '../../domain/task/task.repository';

@Injectable()
export class GetTaskUseCase {
  constructor(private readonly taskRepository: TaskRepository) {}

  async execute(id: string): Promise<Task | null> {
    return this.taskRepository.findById(id);
  }
}
