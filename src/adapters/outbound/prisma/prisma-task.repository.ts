import { Injectable } from '@nestjs/common';
import { Task } from '../../../domain/task/task';
import { TaskRepository } from '../../../domain/task/task.repository';
import { PrismaService } from '../../../infrastructure/prisma/prisma.service';

@Injectable()
export class PrismaTaskRepository implements TaskRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(task: Task): Promise<Task> {
    return this.prisma.task.create({ data: task });
  }

  async findById(id: string): Promise<Task | null> {
    return this.prisma.task.findUnique({ where: { id } });
  }

  async findAll(): Promise<Task[]> {
    return this.prisma.task.findMany();
  }
}
