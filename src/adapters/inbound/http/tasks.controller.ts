import { Body, Controller, Get, NotFoundException, Param, Post } from '@nestjs/common';
import { CreateTaskUseCase } from '../../../application/task/create-task.use-case';
import { GetTaskUseCase } from '../../../application/task/get-task.use-case';
import { ListTasksUseCase } from '../../../application/task/list-tasks.use-case';
import { Task } from '../../../domain/task/task';

@Controller('tasks')
export class TasksController {
  constructor(
    private readonly createTask: CreateTaskUseCase,
    private readonly getTask: GetTaskUseCase,
    private readonly listTasks: ListTasksUseCase,
  ) {}

  @Post()
  async create(@Body('title') title: string): Promise<Task> {
    return this.createTask.execute(title);
  }

  @Get()
  async findAll(): Promise<Task[]> {
    return this.listTasks.execute();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Task> {
    const task = await this.getTask.execute(id);
    if (!task) {
      throw new NotFoundException(`Task ${id} not found`);
    }
    return task;
  }
}
