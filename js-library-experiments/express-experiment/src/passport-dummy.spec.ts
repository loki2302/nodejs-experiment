import {expect} from 'chai';

import * as express from "express";
import * as http from "http";
import axios, {AxiosInstance} from "axios";
import * as passport from "passport";
import {StrategyCreated} from "passport";

class DummyStrategy implements passport.Strategy {
    get name() {
        return 'dummy';
    }

    authenticate(this: StrategyCreated<this>, req: express.Request, options?: any): any {
        if(req.query.password === 'qwerty') {
            return this.success(<any>'the user');
        }

        return this.fail(401);
    }
}

describe('dummy strategy for passport', () => {
    let server: http.Server;
    let client: AxiosInstance;
    before((done) => {
        const app = express();

        passport.use(new DummyStrategy());

        app.use(passport.initialize());
        app.use(passport.authenticate('dummy', { session: false }));

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

    it('should respond with 401 when there is no password', async () => {
        const response = await client.get('/');
        expect(response.status).to.equal(401);
        expect(response.data).to.equal('Unauthorized');
    });

    it('should respond with 200 when there is password', async () => {
        const response = await client.get('/', {
            params: {
                'password': 'qwerty'
            }
        });
        expect(response.status).to.equal(200);
        expect(response.data).to.equal('hello world! the user');
    });
});
