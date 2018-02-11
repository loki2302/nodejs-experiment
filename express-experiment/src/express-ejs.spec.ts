import {expect} from 'chai';

import * as express from "express";
import * as http from "http";
import axios, {AxiosInstance} from "axios";

describe('express', () => {
    describe('ejs', () => {
        let server: http.Server;
        let client: AxiosInstance;
        before((done) => {
            const app = express();

            app.set('view engine', 'ejs');
            app.set('views', __dirname + '/views');

            app.get('/', (req, res) => {
                res.render('index', {
                    message: 'hi there'
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
            const response = await client.get('/');
            expect(response.status).to.equal(200);
            expect(response.data).to.equal('The message is hi there');
        });
    });
});
