import { Module } from '@nestjs/common';
import { CreateTaskUseCase } from '../../../application/task/create-task.use-case';
import { GetTaskUseCase } from '../../../application/task/get-task.use-case';
import { ListTasksUseCase } from '../../../application/task/list-tasks.use-case';
import { TaskRepository } from '../../../domain/task/task.repository';
import { PrismaTaskRepository } from '../../outbound/prisma/prisma-task.repository';
import { TasksController } from './tasks.controller';

@Module({
  controllers: [TasksController],
  providers: [
    CreateTaskUseCase,
    GetTaskUseCase,
    ListTasksUseCase,
    { provide: TaskRepository, useClass: PrismaTaskRepository },
  ],
})
export class TasksModule {}
