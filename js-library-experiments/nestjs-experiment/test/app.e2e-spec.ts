import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PutTodoBody, TodosPage, TodoStatus } from '../src/todo.controller';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { unlinkSync } from 'fs';
import { EntityManager } from 'typeorm';
import { TodoEntity, TodoEntityStatus } from '../src/todo.entity';

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
            expect(response.status).toStrictEqual(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(response.body.message).toContain('Something terrible happened!');
        });
    });

    describe('HTML5 urls', () => {
        it('works', async () => {
            const response = await request(app.getHttpServer()).get('/some/crazy-url/here/123?x=222');
            expect(response.status).toStrictEqual(HttpStatus.OK);
            expect(response.text).toContain('<h1>Hello World!!!</h1>');
        });
    });

    describe('GET /todos/:id', () => {
        it('should 404 when there is no todo', async () => {
            const response = await request(app.getHttpServer()).get('/todos/123');
            expect(response.status).toStrictEqual(HttpStatus.NOT_FOUND);
        });

        it('should return a todo when there is a todo', async () => {
            const todo = new TodoEntity();
            todo.id = 111;
            todo.text = 'one one one';
            todo.status = TodoEntityStatus.NOT_STARTED;
            await entityManager.save(todo);

            const response = await request(app.getHttpServer()).get('/todos/111');
            expect(response.status).toStrictEqual(HttpStatus.OK);
            expect(response.body).toStrictEqual({
                id: 111,
                text: 'one one one',
                status: TodoStatus.NOT_STARTED
            });
        });
    });

    describe('DELETE /todos/:id', () => {
        it('should 404 when there is no todo', async () => {
            const response = await request(app.getHttpServer()).delete('/todos/123');
            expect(response.status).toStrictEqual(HttpStatus.NOT_FOUND);
        });

        it('should delete a todo when there is a todo', async () => {
            const todo = new TodoEntity();
            todo.id = 111;
            todo.text = 'one one one';
            todo.status = TodoEntityStatus.NOT_STARTED;
            await entityManager.save(todo);

            const response = await request(app.getHttpServer()).delete('/todos/111');
            expect(response.status).toStrictEqual(HttpStatus.NO_CONTENT);

            expect(await entityManager.count(TodoEntity)).toStrictEqual(0);
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
            todo1.status = TodoEntityStatus.NOT_STARTED;

            const todo2 = new TodoEntity();
            todo2.id = 222;
            todo2.text = 'two two two';
            todo2.status = TodoEntityStatus.NOT_STARTED;

            await entityManager.save([todo1, todo2]);

            const response = await request(app.getHttpServer()).get('/todos');
            const body = response.body as TodosPage;
            expect(body.total).toStrictEqual(2);
            expect(body.skip).toStrictEqual(0);
            expect(body.take).toStrictEqual(10);
            expect(body.items).toStrictEqual([
                { id: 111, text: 'one one one', status: TodoStatus.NOT_STARTED },
                { id: 222, text: 'two two two', status: TodoStatus.NOT_STARTED }
            ]);
        });

        describe('sorting and filtering', () => {
            beforeEach(async () => {
                const todo1 = new TodoEntity();
                todo1.id = 111;
                todo1.text = 'one one one';
                todo1.status = TodoEntityStatus.NOT_STARTED;

                const todo2 = new TodoEntity();
                todo2.id = 222;
                todo2.text = 'two two two';
                todo2.status = TodoEntityStatus.DONE;

                const todo3 = new TodoEntity();
                todo3.id = 333;
                todo3.text = 'three three three';
                todo3.status = TodoEntityStatus.NOT_STARTED;

                const todo4 = new TodoEntity();
                todo4.id = 444;
                todo4.text = 'four four four';
                todo4.status = TodoEntityStatus.IN_PROGRESS;

                await entityManager.save([todo1, todo2, todo3, todo4]);
            });

            it('should sort', async () => {
                const get = async (url) => {
                    return (await request(app.getHttpServer()).get(url)).body.items.map(i => i.id);
                };

                expect(await get('/todos?sortBy=id')).toEqual([111, 222, 333, 444]);
                expect(await get('/todos?sortBy=id&direction=asc')).toEqual([111, 222, 333, 444]);
                expect(await get('/todos?sortBy=id&direction=desc')).toEqual([444, 333, 222, 111]);

                expect(await get('/todos?sortBy=text')).toEqual([444, 111, 333, 222]);
                expect(await get('/todos?sortBy=text&direction=asc')).toEqual([444, 111, 333, 222]);
                expect(await get('/todos?sortBy=text&direction=desc')).toEqual([222, 333, 111, 444]);

                expect(await get('/todos?sortBy=status')).toEqual([222, 444, 111, 333]);
                expect(await get('/todos?sortBy=status&direction=asc')).toEqual([222, 444, 111, 333]);
                expect(await get('/todos?sortBy=status&direction=desc')).toEqual([111, 333, 444, 222]);
            });
        });
    });

    describe('PUT /todos/:id', () => {
        it('should 400 if body does not pass the validation', async () => {
            const response = await request(app.getHttpServer()).put('/todos/111').send({
                text: ''
            } as PutTodoBody);
            expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
            expect(response.body.message).toEqual(expect.arrayContaining([
                expect.objectContaining({
                    property: 'text',
                    constraints: {
                        isNotEmpty: expect.stringContaining('should not be empty')
                    }
                }),
                expect.objectContaining({
                    property: 'status',
                    constraints: {
                        isIn: expect.stringContaining('must be one of the following')
                    }
                })
            ]));
        });

        it('should create a todo if todo does not exist yet', async () => {
            await request(app.getHttpServer()).put('/todos/111').send({
                text: 'hello world',
                status: TodoStatus.NOT_STARTED
            } as PutTodoBody);

            const todo = await entityManager.findOne(TodoEntity, 111);
            expect(todo).toEqual({
                id: 111,
                text: 'hello world',
                status: TodoEntityStatus.NOT_STARTED
            });
        });

        it('should update todo if todo already exists', async () => {
            const originalTodo = new TodoEntity();
            originalTodo.id = 111;
            originalTodo.text = 'one one one';
            originalTodo.status = TodoEntityStatus.NOT_STARTED;
            await entityManager.save(originalTodo);

            await request(app.getHttpServer()).put('/todos/111').send({
                text: 'hello world',
                status: TodoStatus.IN_PROGRESS
            } as PutTodoBody);

            const updatedTodo = await entityManager.findOne(TodoEntity, 111);
            expect(updatedTodo).toEqual({
                id: 111,
                text: 'hello world',
                status: TodoEntityStatus.IN_PROGRESS
            });
        });
    });

    describe('PATCH /todos/:id', () => {
        it('should 404 when there is no todo', async () => {
            const response = await request(app.getHttpServer()).patch('/todos/123').send({
                text: 'hello'
            });
            expect(response.status).toStrictEqual(HttpStatus.NOT_FOUND);
        });

        it('should patch a todo when there is a todo', async () => {
            const todo = new TodoEntity();
            todo.id = 111;
            todo.text = 'one one one';
            todo.status = TodoEntityStatus.NOT_STARTED;
            await entityManager.save(todo);

            const response = await request(app.getHttpServer()).patch('/todos/111').send({
                text: 'hello'
            });
            expect(response.status).toStrictEqual(HttpStatus.NO_CONTENT);

            const patchedTodo = await entityManager.findOne(TodoEntity, 111);
            expect(patchedTodo).toEqual({
                id: 111,
                text: 'hello',
                status: TodoEntityStatus.NOT_STARTED
            });
        });
    });
});
