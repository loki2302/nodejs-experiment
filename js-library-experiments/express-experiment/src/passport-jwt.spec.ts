import {expect} from 'chai';

import * as express from "express";
import {Strategy as JwtStrategy, ExtractJwt, VerifiedCallback} from "passport-jwt";
import * as http from "http";
import axios, {AxiosInstance} from "axios";
import * as jwt from "jsonwebtoken";
import * as passport from "passport";

describe('passport-jwt', () => {
    const JWT_SECRET = 'i like kefir';

    let server: http.Server;
    let client: AxiosInstance;
    before((done) => {
        const app = express();

        passport.use(new JwtStrategy({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: JWT_SECRET
        }, (payload: any, done: VerifiedCallback) => {
            done(null, payload.name);
        }));

        app.use(passport.initialize());
        app.use(passport.authenticate('jwt', { session: false }));

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
        const token = jwt.sign({ name: 'medved' }, JWT_SECRET);
        const response = await client.get('/', {
            headers: {
                authorization: 'Bearer ' + token
            }
        });
        expect(response.status).to.equal(200);
        expect(response.data).to.equal('hello world! medved');
    });
});
