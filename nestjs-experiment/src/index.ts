import "reflect-metadata";

import {NestFactory} from "@nestjs/core";
import {DocumentBuilder, SwaggerModule} from "@nestjs/swagger";
import {MyValidationPipe} from "./my-validation.pipe";
import {AppModule} from "./app.module";

(async () => {
    const app = await NestFactory.create(AppModule);

    const options = new DocumentBuilder()
        .setTitle('Notes API')
        .setDescription('Use this API to work with notes.')
        .setVersion('1.0')
        .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/docs', app, document);

    app.useGlobalPipes(new MyValidationPipe());

    await app.listen(3000);
})();
