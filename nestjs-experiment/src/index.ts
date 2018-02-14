import "reflect-metadata";

import {NestFactory} from "@nestjs/core";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {MyValidationPipe} from "./my-validation.pipe";
import {AppModule} from "./app.module";
import * as express from "express";

(async () => {
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

    const port = 3000;
    await nestApp.listen(port, () => {
        console.log(`Listening at port ${port}`);
    });
})();
