import {expect} from 'chai';

import * as express from "express";
import * as http from "http";
import axios, {AxiosInstance} from "axios";
import * as session from "express-session";
import axiosCookieJarSupport from "@3846masa/axios-cookiejar-support";
import * as passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

describe('express-session', () => {
    let server: http.Server;
    let client: AxiosInstance;
    beforeEach((done) => {
        const app = express();

        passport.use(new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password'
        }, (username, password, done2) => {
            if(username === 'medved' && password === 'preved') {
                return done2(null, username);
            }
            return done2(null, false);
        }));

        passport.serializeUser((user, done) => {
            done(null, user);
        });

        passport.deserializeUser((id, done) => {
            done(null, id);
        });

        app.use(session({
            secret: 'i like kefir',
            resave: false,
            saveUninitialized: false
        }));

        app.use(express.json());

        app.use(passport.initialize());

        app.post('/login', passport.authenticate('local'), (req, res) => {
            res.send('ok');
        });

        app.use(passport.session());

        // I have to enforce this manually, because passport.session() doesn't care if there's a user or not
        app.use((req, res, next) => {
            if(!req.user) {
                return res.status(401).send('Unauthorized');
            }
            next();
        });

        app.post('/logout', (req, res) => {
            req.logout();
            res.send('logged out');
        });

        app.get('/', (req, res) => {
            res.send('hello ' + req.user);
        });

        server = app.listen(3000, () => {
            done();
        });

        client = axios.create(<any>{
            baseURL: 'http://localhost:3000',
            jar: true,
            withCredentials: true,
            validateStatus: (status: number) => true
        });

        axiosCookieJarSupport(client);
    });

    afterEach((done) => {
        server.close(() => {
            done();
        });
    });

    it('should 401 when username and password are not correct', async () => {
        const response = await client.post('/login', {
            username: 'qqq',
            password: 'www'
        });
        expect(response.status).to.equal(401);
    });

    it('should 200 when username and password are correct', async () => {
        const response = await client.post('/login', {
            username: 'medved',
            password: 'preved'
        });
        expect(response.status).to.equal(200);
    });

    it('should not allow me to access / when I am not authenticated', async () => {
        const response = await client.get('/');
        expect(response.status).to.equal(401);
        expect(response.data).to.equal('Unauthorized');
    });

    it('should allow me to access / when I am authenticated', async () => {
        await client.post('/login', {
            username: 'medved',
            password: 'preved'
        });

        const response = await client.get('/');
        expect(response.status).to.equal(200);
        expect(response.data).to.equal('hello medved');
    });

    it('should stop allowing me to access / when I log out', async () => {
        await client.post('/login', {
            username: 'medved',
            password: 'preved'
        });

        const response1 = await client.get('/');
        expect(response1.status).to.equal(200);
        expect(response1.data).to.equal('hello medved');

        const logoutResponse = await client.post('/logout');
        expect(logoutResponse.data).to.equal('logged out');

        const response2 = await client.get('/');
        expect(response2.status).to.equal(401);
        expect(response2.data).to.equal('Unauthorized');
    });
});
