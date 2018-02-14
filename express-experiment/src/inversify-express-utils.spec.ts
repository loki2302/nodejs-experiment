import "reflect-metadata";

import {expect} from 'chai';

import * as http from "http";
import * as express from "express";
import axios, {AxiosInstance} from "axios";
import {
    controller, httpGet, httpPost, InversifyExpressServer, requestBody,
    requestParam
} from "inversify-express-utils";
import {Container, inject, injectable} from "inversify";

@injectable()
class CalculatorService {
    addNumbers(a: number, b: number): number {
        return a + b;
    }

    subtractNumbers(a: number, b: number): number {
        return a - b;
    }
}

interface ResultDto {
    result: number;
}

class SubtractRequestDto {
    a: number;
    b: number;

    constructor(a: number, b: number) {
        this.a = a;
        this.b = b;
    }
}

@controller('/calculator')
class CalculatorController {
    constructor(@inject(CalculatorService) private calculatorService: CalculatorService) {
    }

    @httpGet('/add/:a/:b')
    add(@requestParam('a') a: number, @requestParam('b') b: number): ResultDto {
        // TODO: how do I convert these more nicely?
        a = parseInt(<any>a, 10);
        b = parseInt(<any>b, 10);
        return {
            result: this.calculatorService.addNumbers(a, b)
        };
    }

    @httpPost('/subtract')
    subtract(@requestBody() requestBody: SubtractRequestDto): ResultDto {
        return {
            result: this.calculatorService.subtractNumbers(requestBody.a, requestBody.b)
        };
    }
}

describe('inversify-express-utils', () => {
    describe('should work', () => {
        let server: http.Server;
        let client: AxiosInstance;
        before((done) => {
            const container = new Container();
            container.bind<CalculatorService>(CalculatorService).toSelf().inSingletonScope();

            const app = new InversifyExpressServer(container)
                .setConfig(app => {
                    app.use(express.json());
                })
                .build();

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

        it('should handle GET', async () => {
            const response = await client.get('/calculator/add/2/3');
            expect(response.status).to.equal(200);
            expect(response.data).to.deep.equal({
                result: 5
            });
        });

        it('should handle POST', async () => {
            const response = await client.post('/calculator/subtract', {
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
