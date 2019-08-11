import {NestFactory} from "@nestjs/core";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {MyValidationPipe} from "./my-validation.pipe";
import {AppModule} from "./app.module";
import * as express from "express";
import * as http from "http";
import {MyHttpExceptionFilter} from "./my-http-exception.filter";

export async function startApp(): Promise<http.Server> {
    const app = express();

    app.use(express.static(__dirname + '/static'));

    const nestApp = await NestFactory.create(AppModule, app);
    const options = new DocumentBuilder()
        .setTitle('Notes API')
        .setDescription('Use this API to work with notes.')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(nestApp, options);
    SwaggerModule.setup('/docs', nestApp, document);
    nestApp.useGlobalPipes(new MyValidationPipe());
    nestApp.useGlobalFilters(new MyHttpExceptionFilter());

    const port = 3000;
    const server = await nestApp.listen(port, () => {
        console.log(`Listening at port ${port}`);
    });

    return server;
}
