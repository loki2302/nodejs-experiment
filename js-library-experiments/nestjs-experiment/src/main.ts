import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule, makeWinstonModule, makeTypeOrmModule } from './app.module';
import { loadConfig } from './config';

async function bootstrap() {
    const config = loadConfig();
    console.log('CONFIG', JSON.stringify(config, null, 2));

    const typeOrmModule = makeTypeOrmModule(config.dbConfig);
    const loggingModule = makeWinstonModule(config.logConfig);
    const app = await NestFactory.create(AppModule.make(typeOrmModule, loggingModule));
    app.useLogger(app.get('NestWinston'));

    SwaggerModule.setup('swagger', app, SwaggerModule.createDocument(app, new DocumentBuilder()
        .setTitle('Dummy API')
        .setDescription('Dummy API description here')
        .setVersion('1.0')
        .addTag('todos', 'The todos')
        .addOAuth2('password', 'authorization url', '/oauth/token')
        .build()));

    await app.listen(config.port);
}

bootstrap();
