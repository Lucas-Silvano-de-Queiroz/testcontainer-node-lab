import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { AppModule } from '../../src/app.module';
import { Task } from '../../src/domain/task/task';
import { PrismaService } from '../../src/infrastructure/prisma/prisma.service';

describe('Tasks E2E', () => {
  let app: INestApplication | undefined;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] }).compile();
    app = moduleRef.createNestApplication();
    await app.init();
    prisma = app.get(PrismaService);
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  beforeEach(async () => {
    await prisma.task.deleteMany();
  });

  it('POST /tasks — cria task (201) e persiste no PostgreSQL', async () => {
    const response = await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Learn Testcontainers' })
      .expect(201);

    expect(response.body).toMatchObject({ title: 'Learn Testcontainers', completed: false });
    expect(response.body.id).toBeDefined();
    expect(response.body.createdAt).toBeDefined();

    const persisted = await prisma.task.findUnique({ where: { id: response.body.id } });
    expect(persisted).not.toBeNull();
    expect(persisted?.title).toBe('Learn Testcontainers');
  });

  it('GET /tasks — lista as tasks criadas', async () => {
    await request(app.getHttpServer()).post('/tasks').send({ title: 'Task A' }).expect(201);
    await request(app.getHttpServer()).post('/tasks').send({ title: 'Task B' }).expect(201);

    const response = await request(app.getHttpServer()).get('/tasks').expect(200);

    expect(response.body).toHaveLength(2);
    const titles = (response.body as Task[]).map((task) => task.title);
    expect(titles).toEqual(expect.arrayContaining(['Task A', 'Task B']));
  });

  it('GET /tasks/:id — busca task criada pelo id', async () => {
    const created = await request(app.getHttpServer())
      .post('/tasks')
      .send({ title: 'Task C' })
      .expect(201);

    const response = await request(app.getHttpServer())
      .get(`/tasks/${created.body.id}`)
      .expect(200);

    expect(response.body).toMatchObject({ id: created.body.id, title: 'Task C', completed: false });
  });

  it('GET /tasks/:id — retorna 404 para id inexistente', async () => {
    await request(app.getHttpServer())
      .get('/tasks/00000000-0000-4000-8000-000000000000')
      .expect(404);
  });
});
