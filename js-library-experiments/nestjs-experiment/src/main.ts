import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);

    SwaggerModule.setup('swagger', app, SwaggerModule.createDocument(app, new DocumentBuilder()
        .setTitle('Dummy API')
        .setDescription('Dummy API description here')
        .setVersion('1.0')
        .addTag('todos', 'The todos')
        .build()));

    await app.listen(3000);
}

bootstrap();
