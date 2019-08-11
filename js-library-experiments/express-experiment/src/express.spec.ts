import {expect} from 'chai';

import * as express from "express";
import * as http from "http";
import axios, {AxiosInstance} from "axios";
import {ErrorRequestHandler} from "express-serve-static-core";

describe('express', () => {
    describe('hello world', () => {
        let server: http.Server;
        let client: AxiosInstance;
        before((done) => {
            const app = express();

            app.get('/', (req, res) => {
                res.send('hello world');
            });

            server = app.listen(3000, () => {
                done();
            });

            client = axios.create({
                baseURL: 'http://localhost:3000'
            });
        });

        after((done) => {
            server.close(() => {
                done();
            });
        });

        it('should work', async () => {
            const response = await client.get('/');
            expect(response.status).to.equal(200);
            expect(response.data).to.equal('hello world');
        });
    });

    describe('middleware chaining for 1 method', () => {
        let server: http.Server;
        let client: AxiosInstance;
        before((done) => {
            const app = express();

            app.get('/',
                (req, res, next) => {
                    (<any>req).customData = 'one';
                    next();
                },
                (req, res, next) => {
                    (<any>req).customData = (<any>req).customData + 'two';
                    next();
                },
                (req, res) => {
                    res.send((<any>req).customData);
                });

            server = app.listen(3000, () => {
                done();
            });

            client = axios.create({
                baseURL: 'http://localhost:3000'
            });
        });

        after((done) => {
            server.close(() => {
                done();
            });
        });

        it('should work', async () => {
            const response = await client.get('/');
            expect(response.status).to.equal(200);
            expect(response.data).to.equal('onetwo');
        });
    });

    describe('middleware chaining for all methods', () => {
        let server: http.Server;
        let client: AxiosInstance;
        before((done) => {
            const app = express();

            app.use((req, res, next) => {
                (<any>req).customData = 'one';
                next();
            });

            app.get('/a', (req, res, next) => {
                (<any>req).customData = (<any>req).customData + 'A';
                next();
            });

            app.get('/b', (req, res, next) => {
                (<any>req).customData = (<any>req).customData + 'B';
                next()
            });

            app.use((req, res, next) => {
                (<any>req).customData = (<any>req).customData + 'two';
                res.send((<any>req).customData);
            });

            server = app.listen(3000, () => {
                done();
            });

            client = axios.create({
                baseURL: 'http://localhost:3000'
            });
        });

        after((done) => {
            server.close(() => {
                done();
            });
        });

        it('should work', async () => {
            const responseB = await client.get('/a');
            expect(responseB.data).to.equal('oneAtwo');

            const responseA = await client.get('/b');
            expect(responseA.data).to.equal('oneBtwo');
        });
    });

    describe('error handling', () => {
        let server: http.Server;
        let client: AxiosInstance;
        before((done) => {
            const app = express();

            app.get('/', (req, res, next) => {
                next(new Error('super critical error'));
            });

            app.use(<ErrorRequestHandler>((err, req, res, next) => {
                res.status(500).send('got error: ' + err.message);
            }));

            server = app.listen(3000, () => {
                done();
            });

            client = axios.create({
                baseURL: 'http://localhost:3000',
                validateStatus: status => true
            });
        });

        after((done) => {
            server.close(() => {
                done();
            });
        });

        it('should work', async () => {
            const response = await client.get('/');
            expect(response.status).to.equal(500);
            expect(response.data).to.equal('got error: super critical error');
        });
    });

    describe('param', () => {
        let server: http.Server;
        let client: AxiosInstance;
        before((done) => {
            const app = express();

            app.param('userId', (req, res, next, userId) => {
                (<any>req).username = `user-${userId}`;
                next();
            });

            app.get('/:userId', (req, res) => {
                const username = (<any>req).username;
                res.send(`user is ${username}`);
            });

            server = app.listen(3000, () => {
                done();
            });

            client = axios.create({
                baseURL: 'http://localhost:3000',
                validateStatus: status => true
            });
        });

        after((done) => {
            server.close(() => {
                done();
            });
        });

        it('should work', async () => {
            const response = await client.get('/222');
            expect(response.status).to.equal(200);
            expect(response.data).to.equal('user is user-222');
        });
    });

    describe('JSON body', () => {
        let server: http.Server;
        let client: AxiosInstance;
        before((done) => {
            const app = express();

            app.use(express.json());

            app.post('/', (req, res) => {
                const { a, b } = req.body;
                res.json({
                    sum: a + b,
                    difference: a - b
                });
            });

            server = app.listen(3000, () => {
                done();
            });

            client = axios.create({
                baseURL: 'http://localhost:3000'
            });
        });

        after((done) => {
            server.close(() => {
                done();
            });
        });

        it('should work', async () => {
            const response = await client.post('/', {
                a: 2,
                b: 3
            });
            expect(response.status).to.equal(200);
            expect(response.data).to.deep.equal({
                sum: 5,
                difference: -1
            });
        });
    });

    describe('path and query params', () => {
        let server: http.Server;
        let client: AxiosInstance;
        before((done) => {
            const app = express();

            app.get('/:a', (req, res) => {
                const a = parseInt(req.params.a, 10);
                const b = parseInt(req.query.b, 10);
                res.json({
                    sum: a + b,
                    difference: a - b
                });
            });

            server = app.listen(3000, () => {
                done();
            });

            client = axios.create({
                baseURL: 'http://localhost:3000'
            });
        });

        after((done) => {
            server.close(() => {
                done();
            });
        });

        it('should work', async () => {
            const response = await client.get('/2?b=3');
            expect(response.status).to.equal(200);
            expect(response.data).to.deep.equal({
                sum: 5,
                difference: -1
            });
        });
    });

    describe('express.static()', () => {
        let server: http.Server;
        let client: AxiosInstance;
        before((done) => {
            const app = express();

            app.use(express.static(__dirname + '/static'));

            server = app.listen(3000, () => {
                done();
            });

            client = axios.create({
                baseURL: 'http://localhost:3000',
                validateStatus: status => true
            });
        });

        after((done) => {
            server.close(() => {
                done();
            });
        });

        it('should provide the file contents if that file exists', async () => {
            const response = await client.get('/1.txt');
            expect(response.status).to.equal(200);
            expect(response.data).to.equal('hello there');
        });

        it('should say 404 if the file does not exist', async () => {
            const response = await client.get('/2.txt');
            expect(response.status).to.equal(404);
        });
    });

    describe('express.Router()', () => {
        let server: http.Server;
        let client: AxiosInstance;
        before((done) => {
            const app = express();

            const routerA = express.Router();
            routerA.get('/', (req, res) => res.send('routerA GET /'));
            routerA.get('/:id', (req, res) => res.send('routerA GET /:id'));

            const routerB = express.Router();
            routerB.get('/', (req, res) => res.send('routerB GET /'));
            routerB.get('/:id', (req, res) => res.send('routerB GET /:id'));

            app.use('/a', routerA);
            app.use('/b', routerB);

            server = app.listen(3000, () => {
                done();
            });

            client = axios.create({
                baseURL: 'http://localhost:3000'
            });
        });

        after((done) => {
            server.close(() => {
                done();
            });
        });

        it('should work', async () => {
            expect((await client.get('/a')).data).to.equal('routerA GET /');
            expect((await client.get('/a/123')).data).to.equal('routerA GET /:id');
            expect((await client.get('/b')).data).to.equal('routerB GET /');
            expect((await client.get('/b/123')).data).to.equal('routerB GET /:id');
        });
    });
});
