import {expect} from 'chai';

import * as express from "express";
import * as http from "http";
import axios, {AxiosInstance} from "axios";
import * as session from "express-session";
import axiosCookieJarSupport from "@3846masa/axios-cookiejar-support";

describe('express-session', () => {
    let server: http.Server;
    let client: AxiosInstance;
    before((done) => {
        const app = express();

        app.use(session({
            secret: 'i like kefir',
            resave: false,
            saveUninitialized: false
        }));

        app.use(express.json());

        app.put('/', (req, res, next) => {
            if(!req.session) {
                return next(new Error('session is not defined'));
            }

            req.session.data = req.body;
            res.send('ok');
        });

        app.get('/', (req, res, next) => {
            if(!req.session) {
                return next(new Error('session is not defined'));
            }

            const data = req.session.data ? req.session.data : {};
            res.json(data);
        });

        server = app.listen(3000, () => {
            done();
        });

        client = axios.create(<any>{
            baseURL: 'http://localhost:3000',
            jar: true,
            withCredentials: true
        });

        axiosCookieJarSupport(client);
    });

    after((done) => {
        server.close(() => {
            done();
        });
    });

    it('should work', async () => {
        const response1 = await client.get('/');
        expect(response1.data).to.deep.equal({});

        await client.put('/', {
            message: 'hi there',
        });

        const response2 = await client.get('/');
        expect(response2.data).to.deep.equal({
            message: 'hi there'
        });
    });
});
