import {expect} from 'chai';

import * as express from "express";
import {BasicStrategy} from "passport-http";
import * as http from "http";
import axios, {AxiosInstance} from "axios";
import * as passport from "passport";

describe('passport-http', () => {
    let server: http.Server;
    let client: AxiosInstance;
    before((done) => {
        const app = express();

        passport.use(new BasicStrategy(((username, password, done2) => {
            if(username != 'medved' && password != 'qwerty') {
                return done2(null, false);
            }
            return done2(null, username);
        })));

        app.use(passport.initialize());
        app.use(passport.authenticate('basic', { session: false }));

        app.get('/', (req, res) => {
            res.send('hello world! ' + req.user);
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
        expect(response.data).to.equal('Unauthorized');
    });

    it('should respond with 200 when there is token', async () => {
        const response = await client.get('/', {
            auth: {
                username: 'medved',
                password: 'qwerty'
            }
        });
        expect(response.status).to.equal(200);
        expect(response.data).to.equal('hello world! medved');
    });
});
