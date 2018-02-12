import "reflect-metadata";

import {expect} from 'chai';

import * as express from "express";
import * as http from "http";
import axios, {AxiosInstance} from "axios";
import {Body, Controller, createExpressServer, Get, JsonController, Param, Post} from "routing-controllers";

interface ResultDto {
    result: number;
}

interface SubtractRequestDto {
    a: number;
    b: number;
}

@JsonController('/api')
class CalculatorController {
    @Get("/add/:a/:b")
    add(@Param("a") a: number, @Param("b") b: number): ResultDto {
        return {
            result: a + b
        };
    }

    @Post("/subtract")
    async subtract(@Body() requestBody: SubtractRequestDto): Promise<ResultDto> {
        await new Promise(resolve => {
            setTimeout(() => resolve(), 100);
        });
        return {
            result: requestBody.a - requestBody.b
        };
    }
}

describe('routing-controllers', () => {
    describe('hello world', () => {
        let server: http.Server;
        let client: AxiosInstance;
        before((done) => {
            const app = createExpressServer({
                controllers: [ CalculatorController ]
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

        it('should allow me to add numbers', async () => {
            const response = await client.get('/api/add/2/3');
            expect(response.status).to.equal(200);
            expect(response.data).to.deep.equal({
                result: 5
            });
        });

        it('should allow me to subtract numbers', async () => {
            const response = await client.post<ResultDto>('/api/subtract', {
                a: 2,
                b: 3
            });
            expect(response.status).to.equal(200);
            expect(response.data).to.deep.equal({
                result: -1
            });
        });
    });
});
