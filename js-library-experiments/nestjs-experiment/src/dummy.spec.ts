import "reflect-metadata";
import {startApp} from "./app";
import * as http from "http";
import axios, {AxiosInstance} from "axios";

describe('A dummy integration test', () => {
    let server: http.Server;
    let client: AxiosInstance;
    beforeEach(async () => {
        server = await startApp();

        client = axios.create({
            baseURL: 'http://localhost:3000'
        });
    });

    afterEach(async () => {
        return new Promise(resolve => server.close(resolve));
    });

    it('should work', async () => {
        const response = await client.get('/docs');
        expect(response.data).toContain('<div id="swagger-ui"></div>');
    });
});
