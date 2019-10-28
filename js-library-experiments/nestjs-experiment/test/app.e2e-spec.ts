import { Test, TestingModule } from '@nestjs/testing';
import { AppModule, makeSqliteDatabaseModule } from './../src/app.module';
import { PutTodoBody, TodosPage, TodoStatus } from '../src/todo.controller';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { unlinkSync } from 'fs';
import { EntityManager } from 'typeorm';
import { TodoEntity, TodoEntityStatus } from '../src/entities';
import Axios, { AxiosInstance } from 'axios';
import * as oauth from 'axios-oauth-client';
import * as tokenProvider from 'axios-token-interceptor';

describe('the app', () => {
    let app: INestApplication;
    let entityManager: EntityManager;
    beforeEach(async () => {
        try {
            unlinkSync('db');
        } catch { /* intentionally blank */}

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule.make(makeSqliteDatabaseModule('db'), 'info')]
        }).compile();

        app = moduleFixture.createNestApplication();
        entityManager = app.get(EntityManager);

        await app.listen(3000);
    });

    afterEach(async () => {
        await app.close();
    });

    describe('Custom exception handling', () => {
        it('works', async () => {
            const response = await Axios.get('http://localhost:3000/throw', { validateStatus: () => true });
            expect(response.status).toStrictEqual(HttpStatus.INTERNAL_SERVER_ERROR);
            expect(response.data.message).toContain('Something terrible happened!');
        });
    });

    describe('HTML5 urls', () => {
        it('works', async () => {
            const response = await Axios.get('http://localhost:3000/some/crazy-url/here/123?x=222');
            expect(response.status).toStrictEqual(HttpStatus.OK);
            expect(response.data).toContain('<h1>Hello World!!!</h1>');
        });
    });

    it('should not let me in without token', async () => {
        const response = await Axios.request({
            method: 'get',
            url: 'http://localhost:3000/todos/111',
            validateStatus: () => true
        });
        expect(response.status).toStrictEqual(HttpStatus.UNAUTHORIZED);
    });

    it('should let me in with token', async () => {
        const todo = new TodoEntity();
        todo.id = 111;
        todo.text = 'one one one';
        todo.status = TodoEntityStatus.NOT_STARTED;
        await entityManager.save(todo);

        const getCredentialsViaUsernameAndPassword = oauth.client(Axios.create(), {
            url: 'http://localhost:3000/oauth/token',
            grant_type: 'password',
            client_id: 'client1',
            client_secret: 'client1Secret',
            username: 'user1',
            password: 'password1',
            scope: 'dummy'
        });

        const credentials = await getCredentialsViaUsernameAndPassword();
        const accessToken = credentials.access_token;

        const response = await Axios.request({
            method: 'get',
            url: 'http://localhost:3000/todos/111',
            validateStatus: () => true,
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        expect(response.status).toStrictEqual(HttpStatus.OK);
        expect(response.data).toStrictEqual(expect.objectContaining({
            id: 111,
            text: 'one one one',
            status: TodoStatus.NOT_STARTED
        }));
    });

    describe('/todos', () => {
        let axios: AxiosInstance;
        beforeEach(() => {
            const getCredentialsViaUsernameAndPassword = oauth.client(Axios.create(), {
                url: 'http://localhost:3000/oauth/token',
                grant_type: 'password',
                client_id: 'client1',
                client_secret: 'client1Secret',
                username: 'user1',
                password: 'password1',
                scope: 'dummy'
            });

            axios = Axios.create({
                baseURL: 'http://localhost:3000',
                validateStatus: () => true
            });
            axios.interceptors.request.use(oauth.interceptor(tokenProvider, getCredentialsViaUsernameAndPassword));
        });

        describe('GET /todos/:id', () => {
            it('should 404 when there is no todo', async () => {
                const response = await axios.get('/todos/123');
                expect(response.status).toStrictEqual(HttpStatus.NOT_FOUND);
            });

            it('should return a todo when there is a todo', async () => {
                const todo = new TodoEntity();
                todo.id = 111;
                todo.text = 'one one one';
                todo.status = TodoEntityStatus.NOT_STARTED;
                await entityManager.save(todo);

                const response = await axios.get('/todos/111');
                expect(response.status).toStrictEqual(HttpStatus.OK);
                expect(response.data).toStrictEqual(expect.objectContaining({
                    id: 111,
                    text: 'one one one',
                    status: TodoStatus.NOT_STARTED
                }));
            });
        });

        describe('DELETE /todos/:id', () => {
            it('should 404 when there is no todo', async () => {
                const response = await axios.delete('/todos/123');
                expect(response.status).toStrictEqual(HttpStatus.NOT_FOUND);
            });

            it('should delete a todo when there is a todo', async () => {
                const todo = new TodoEntity();
                todo.id = 111;
                todo.text = 'one one one';
                todo.status = TodoEntityStatus.NOT_STARTED;
                await entityManager.save(todo);

                const response = await axios.delete('/todos/111');
                expect(response.status).toStrictEqual(HttpStatus.NO_CONTENT);

                expect(await entityManager.count(TodoEntity)).toStrictEqual(0);
            });
        });

        describe('GET /todos', () => {
            it('should return no todos when there are no todos', async () => {
                const response = await axios.get('/todos');
                const body = response.data as TodosPage;
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

                const response = await axios.get('/todos');
                const body = response.data as TodosPage;
                expect(body.total).toStrictEqual(2);
                expect(body.skip).toStrictEqual(0);
                expect(body.take).toStrictEqual(10);
                expect(body.items).toStrictEqual([
                    expect.objectContaining({ id: 111, text: 'one one one', status: TodoStatus.NOT_STARTED }),
                    expect.objectContaining({ id: 222, text: 'two two two', status: TodoStatus.NOT_STARTED })
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
                        return (await axios.get(url)).data.items.map(i => i.id);
                    };

                    expect(await get('/todos?sortBy=id')).toStrictEqual([111, 222, 333, 444]);
                    expect(await get('/todos?sortBy=id&direction=asc')).toStrictEqual([111, 222, 333, 444]);
                    expect(await get('/todos?sortBy=id&direction=desc')).toStrictEqual([444, 333, 222, 111]);

                    expect(await get('/todos?sortBy=text')).toStrictEqual([444, 111, 333, 222]);
                    expect(await get('/todos?sortBy=text&direction=asc')).toStrictEqual([444, 111, 333, 222]);
                    expect(await get('/todos?sortBy=text&direction=desc')).toStrictEqual([222, 333, 111, 444]);

                    expect(await get('/todos?sortBy=status')).toStrictEqual([222, 444, 111, 333]);
                    expect(await get('/todos?sortBy=status&direction=asc')).toStrictEqual([222, 444, 111, 333]);
                    expect(await get('/todos?sortBy=status&direction=desc')).toStrictEqual([111, 333, 444, 222]);
                });
            });
        });

        describe('PUT /todos/:id', () => {
            it('should 400 if body does not pass the validation', async () => {
                const response = await axios.put('/todos/111', {
                    text: ''
                } as PutTodoBody);
                expect(response.status).toStrictEqual(HttpStatus.BAD_REQUEST);
                expect(response.data.message).toStrictEqual(expect.arrayContaining([
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
                await axios.put('/todos/111', {
                    text: 'hello world',
                    status: TodoStatus.NOT_STARTED
                } as PutTodoBody);

                const todo = await entityManager.findOne(TodoEntity, 111);
                expect(todo).toStrictEqual(expect.objectContaining({
                    id: 111,
                    text: 'hello world',
                    status: TodoEntityStatus.NOT_STARTED
                }));
            });

            it('should update todo if todo already exists', async () => {
                const originalTodo = new TodoEntity();
                originalTodo.id = 111;
                originalTodo.text = 'one one one';
                originalTodo.status = TodoEntityStatus.NOT_STARTED;
                await entityManager.save(originalTodo);

                await axios.put('/todos/111', {
                    text: 'hello world',
                    status: TodoStatus.IN_PROGRESS
                } as PutTodoBody);

                const updatedTodo = await entityManager.findOne(TodoEntity, 111);
                expect(updatedTodo).toStrictEqual(expect.objectContaining({
                    id: 111,
                    text: 'hello world',
                    status: TodoEntityStatus.IN_PROGRESS
                }));
            });
        });

        describe('PATCH /todos/:id', () => {
            it('should 404 when there is no todo', async () => {
                const response = await axios.patch('/todos/123', {
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

                const response = await axios.patch('/todos/111', {
                    text: 'hello'
                });
                expect(response.status).toStrictEqual(HttpStatus.NO_CONTENT);

                const patchedTodo = await entityManager.findOne(TodoEntity, 111);
                expect(patchedTodo).toStrictEqual(expect.objectContaining({
                    id: 111,
                    text: 'hello',
                    status: TodoEntityStatus.NOT_STARTED
                }));
            });
        });
    });
});
