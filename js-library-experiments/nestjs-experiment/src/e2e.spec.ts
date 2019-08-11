import "reflect-metadata";
import {Test} from "@nestjs/testing";
import {AppModule} from "./app.module";
import axios, {AxiosInstance} from "axios";
import * as http from "http";
import * as express from "express";
import {Note} from "./note";
import {INestApplication} from "@nestjs/common";
import {Connection} from "typeorm";

describe('e2e', () => {
    let server: http.Server;
    let app: INestApplication;
    let client: AxiosInstance;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            imports: [AppModule]
        })
            .overrideComponent('NoteRepositoryToken')
            .useValue({
                findOneById: (id: number) => {
                    const note = new Note();
                    note.id = id;
                    note.text = `Note #${id}`;
                    return note;
                }
            })
            .compile();

        const expressApp = express();

        app = module.createNestApplication(expressApp);
        await app.init();

        await new Promise(resolve => {
            server = expressApp.listen(3000, () => {
                resolve();
            });
        });

        client = axios.create({
            baseURL: 'http://localhost:3000',
            validateStatus: status => true
        });
    });

    afterEach(async (done) => {
        // should close the DB connection manually, because otherwise it won't manage to open it on the 2nd run
        await app.select(AppModule).get<Connection>('DbConnectionToken').close();

        server.close(() => {
            done();
        });
    });

    it('should work #1', async () => {
        const response = await client.get('/notes/123');
        expect(response.status).toBe(200);
        expect(response.data).toEqual({
            id: 123,
            text: 'Note #123'
        });
    });

    it('should work #2', async () => {
        const response = await client.get('/notes/222');
        expect(response.status).toBe(200);
        expect(response.data).toEqual({
            id: 222,
            text: 'Note #222'
        });
    });
});
