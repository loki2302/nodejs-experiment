import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { loadConfig } from './config';

async function bootstrap() {
    const config = loadConfig();
    const app = await NestFactory.create(AppModule.forRuntime(
        config.APP_MYSQL_HOST,
        config.APP_MYSQL_PORT,
        config.APP_MYSQL_USERNAME,
        config.APP_MYSQL_PASSWORD,
        config.APP_MYSQL_DATABASE));

    SwaggerModule.setup('swagger', app, SwaggerModule.createDocument(app, new DocumentBuilder()
        .setTitle('Dummy API')
        .setDescription('Dummy API description here')
        .setVersion('1.0')
        .addTag('todos', 'The todos')
        .build()));

    await app.listen(3000);
}

bootstrap();
