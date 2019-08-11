import { expect } from "chai";
import * as Koa from "koa";
import {Server} from "http";
import axios from "axios";

describe('koa2', () => {
    let server: Server;

    beforeEach(() => {
        const app = new Koa();
        app.use(async (ctx: Koa.Context, next: () => Promise<any>) => {
            console.log('Requested URL:', ctx.request.url);
            ctx.body = 'hello there ' + ctx.request.url;
        });
        server = app.listen(3000);
    });

    afterEach((done) => {
        server.close(() => {
            done();
        });
    });

    it('should work', async () => {
        const axiosInstance = axios.create({
            baseURL: 'http://localhost:3000'
        });
        const response = await axiosInstance.get('/something');
        const body = response.data;
        expect(body).to.equal('hello there /something');
    });
});
