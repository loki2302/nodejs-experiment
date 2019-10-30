import { Test, TestingModule } from '@nestjs/testing';
import { AppModule, makeWinstonModule, makeTypeOrmModule } from './../src/app.module';
import { TodoStatus } from '../src/todo.controller';
import { HttpStatus, INestApplication } from '@nestjs/common';
import { unlinkSync } from 'fs';
import { EntityManager } from 'typeorm';
import { TodoEntity, TodoEntityStatus, UserEntity } from '../src/entities';
import Axios from 'axios';
import * as oauth from 'axios-oauth-client';

describe('oauth', () => {
    let app: INestApplication;
    let entityManager: EntityManager;
    beforeEach(async () => {
        try {
            unlinkSync('db');
        } catch { /* intentionally blank */}

        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [AppModule.make(
                makeTypeOrmModule({ type: 'sqlite', dbName: 'db' }),
                makeWinstonModule({ mode: 'text', level: 'info' }))
            ]
        }).compile();

        app = moduleFixture.createNestApplication();
        entityManager = app.get(EntityManager);

        await app.listen(3000);
    });

    afterEach(async () => {
        await app.close();
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
        todo.user = await entityManager.findOne(UserEntity, 'user1');
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
});
