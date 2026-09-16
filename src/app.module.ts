import { Module } from '@nestjs/common';
import { TasksModule } from './adapters/inbound/http/tasks.module';
import { PrismaModule } from './infrastructure/prisma/prisma.module';

@Module({
  imports: [PrismaModule, TasksModule],
})
export class AppModule {}
