import {expect} from 'chai';

import * as express from "express";
import * as http from "http";
import axios, {AxiosInstance} from "axios";
import * as RateLimit from "express-rate-limit";

describe('express-rate-limit', () => {
    describe('hello world', () => {
        let server: http.Server;
        let client: AxiosInstance;
        before((done) => {
            const app = express();

            app.use(new RateLimit({
                windowMs: 1000,
                max: 5,
                delayMs: 0
            }));

            app.get('/', (req, res) => {
                res.send('hello world');
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
            const results = [];
            for(let i = 0; i < 8; ++i) {
                const response = await client.get('/');
                results.push(response.status);
            }
            expect(results).to.deep.equal([200, 200, 200, 200, 200, 429, 429, 429]);
        });
    });
});
