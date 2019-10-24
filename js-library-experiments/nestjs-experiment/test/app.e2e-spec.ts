import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PutTodoBody, TodosPage } from '../src/todo.controller';
import { INestApplication } from '@nestjs/common';
import { unlinkSync } from 'fs';
import { EntityManager } from 'typeorm';
import { TodoEntity } from '../src/todo.entity';

describe('the app', () => {
    let app: INestApplication;
    let entityManager: EntityManager;
    beforeEach(async () => {
        try {
            unlinkSync('db');
        } catch { /* intentionally blank */}

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule],
        }).compile();

        app = moduleFixture.createNestApplication();
        entityManager = app.select(AppModule).get(EntityManager);

        await app.init();
    });

    afterEach(async () => {
        await app.close();
    });

    describe('Custom exception handling', () => {
        it('works', async () => {
            const response = await request(app.getHttpServer()).get('/throw');
            expect(response.status).toStrictEqual(500);
            expect(response.body.message).toContain('Something terrible happened!');
        });
    });

    describe('HTML5 urls', () => {
        it('works', async () => {
            const response = await request(app.getHttpServer()).get('/some/crazy-url/here/123?x=222');
            expect(response.status).toStrictEqual(200);
            expect(response.text).toContain('<h1>Hello World!!!</h1>');
        });
    });

    describe('GET /todos', () => {
        it('should return no todos when there are no todos', async () => {
            const response = await request(app.getHttpServer()).get('/todos');
            const body = response.body as TodosPage;
            expect(body.total).toStrictEqual(0);
            expect(body.skip).toStrictEqual(0);
            expect(body.take).toStrictEqual(10);
            expect(body.items).toStrictEqual([]);
        });

        it('should return todos when there are todos', async () => {
            const todo1 = new TodoEntity();
            todo1.id = 111;
            todo1.text = 'one one one';

            const todo2 = new TodoEntity();
            todo2.id = 222;
            todo2.text = 'two two two';

            await entityManager.save([todo1, todo2]);

            const response = await request(app.getHttpServer()).get('/todos');
            const body = response.body as TodosPage;
            expect(body.total).toStrictEqual(2);
            expect(body.skip).toStrictEqual(0);
            expect(body.take).toStrictEqual(10);
            expect(body.items).toStrictEqual([
                { id: 111, text: 'one one one' },
                { id: 222, text: 'two two two' }
            ]);
        });
    });

    describe('PUT /todos/:id', () => {
        it('should 400 if body does not pass the validation', async () => {
            const response = await request(app.getHttpServer()).put('/todos/111').send({
                text: ''
            } as PutTodoBody);
            expect(response.status).toStrictEqual(400);
            const message0 = response.body.message[0];
            expect(message0.property).toStrictEqual('text');
            expect(message0.constraints).toStrictEqual({
                isNotEmpty: 'text should not be empty'
            });
        });

        it('should create a todo if todo does not exist yet', async () => {
            await request(app.getHttpServer()).put('/todos/111').send({
                text: 'hello world'
            } as PutTodoBody);

            const todo = await entityManager.findOne(TodoEntity, 111);
            expect(todo.id).toStrictEqual(111);
            expect(todo.text).toStrictEqual('hello world');
        });

        it('should update todo if todo already exists', async () => {
            const originalTodo = new TodoEntity();
            originalTodo.id = 111;
            originalTodo.text = 'one one one';
            await entityManager.save(originalTodo);

            await request(app.getHttpServer()).put('/todos/111').send({
                text: 'hello world'
            } as PutTodoBody);

            const updatedTodo = await entityManager.findOne(TodoEntity, 111);
            expect(updatedTodo.id).toStrictEqual(111);
            expect(updatedTodo.text).toStrictEqual('hello world');
        });
    });
});
