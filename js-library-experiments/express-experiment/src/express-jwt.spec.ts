import {expect} from 'chai';

import * as express from "express";
import * as expressJwt from "express-jwt";
import * as http from "http";
import axios, {AxiosInstance} from "axios";
import * as jwt from "jsonwebtoken";
import {ErrorRequestHandler} from "express-serve-static-core";

describe('express-js', () => {
    const JWT_SECRET = 'i like kefir';

    let server: http.Server;
    let client: AxiosInstance;
    before((done) => {
        const app = express();

        app.use(expressJwt({
            secret: JWT_SECRET
        }));

        app.use(<ErrorRequestHandler>((err, req, res, next) => {
            if(err.name === 'UnauthorizedError') {
                res.status(401).send('Invalid token');
            } else {
                next(err);
            }
        }));

        app.get('/', (req, res) => {
            res.send('hello world! ' + req.user.name);
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

    it('should respond with 401 when there is no token', async () => {
        const response = await client.get('/');
        expect(response.status).to.equal(401);
        expect(response.data).to.equal('Invalid token');
    });

    it('should respond with 200 when there is token', async () => {
        const token = jwt.sign({ name: 'medved' }, JWT_SECRET);
        const response = await client.get('/', {
            headers: {
                authorization: 'Bearer ' + token
            }
        });
        expect(response.status).to.equal(200);
    });
});
