import "reflect-metadata";

import {expect} from 'chai';

import * as http from "http";
import axios, {AxiosInstance} from "axios";
import {
    Body, createExpressServer, Get, JsonController, Param, Post,
    useContainer
} from "routing-controllers";
import {Max, Min} from "class-validator";
import {Container} from "typedi";

interface ResultDto {
    result: number;
}

class SubtractRequestDto {
    @Min(5)
    @Max(20)
    a: number;

    b: number;

    constructor(a: number, b: number) {
        this.a = a;
        this.b = b;
    }
}

class CalculatorService {
    addNumbers(a: number, b: number): number {
        return a + b;
    }

    subtractNumbers(a: number, b: number): number {
        return a - b;
    }
}

@JsonController('/api')
class CalculatorController {
    constructor(private calculatorService: CalculatorService) {}

    @Get("/add/:a/:b")
    add(@Param("a") a: number, @Param("b") b: number): ResultDto {
        return {
            result: this.calculatorService.addNumbers(a, b)
        };
    }

    @Post("/subtract")
    async subtract(@Body({ required: true, validate: true }) requestBody: SubtractRequestDto): Promise<ResultDto> {
        await new Promise(resolve => {
            setTimeout(() => resolve(), 50);
        });
        return {
            result: this.calculatorService.subtractNumbers(requestBody.a, requestBody.b)
        };
    }
}

describe('routing-controllers', () => {
    describe('hello world', () => {
        let server: http.Server;
        let client: AxiosInstance;
        before((done) => {
            useContainer(Container);

            const app = createExpressServer({
                validation: true/*,
                controllers: [ CalculatorController ]*/
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

        it('should allow me to add numbers', async () => {
            const response = await client.get('/api/add/2/3');
            expect(response.status).to.equal(200);
            expect(response.data).to.deep.equal({
                result: 5
            });
        });

        it('should allow me to subtract numbers if request passes the validation', async () => {
            const response = await client.post('/api/subtract', {
                a: 7,
                b: 3
            });
            expect(response.status).to.equal(200);
            expect(response.data).to.deep.equal({
                result: 4
            });
        });

        // Appears to be broken as of 0.7.6
        xit('should not allow me to subtract numbers if request does not pass the validation', async () => {
            const response = await client.post('/api/subtract', {
                a: 2,
                b: 3
            });
            expect(response.status).to.equal(400);
        });
    });
});
