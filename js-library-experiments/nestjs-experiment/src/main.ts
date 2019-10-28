import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule, makeMysqlDatabaseModule, makeSqliteDatabaseModule } from './app.module';
import { loadConfig } from './config';
import { DynamicModule } from '@nestjs/common';

async function bootstrap() {
    const config = loadConfig();

    let typeOrmModule: DynamicModule;
    if (config.APP_DB_TYPE === 'mysql') {
        typeOrmModule = makeMysqlDatabaseModule(
            config.APP_MYSQL_HOST,
            config.APP_MYSQL_PORT,
            config.APP_MYSQL_USERNAME,
            config.APP_MYSQL_PASSWORD,
            config.APP_MYSQL_DATABASE);
    } else if (config.APP_DB_TYPE === 'sqlite') {
        typeOrmModule = makeSqliteDatabaseModule(config.APP_SQLITE_DATABASE);
    } else {
        throw new Error('Unknown db type');
    }

    const app = await NestFactory.create(AppModule.make(typeOrmModule, config.APP_LOG_LEVEL));

    SwaggerModule.setup('swagger', app, SwaggerModule.createDocument(app, new DocumentBuilder()
        .setTitle('Dummy API')
        .setDescription('Dummy API description here')
        .setVersion('1.0')
        .addTag('todos', 'The todos')
        .addOAuth2('password', 'authorization url', '/oauth/token')
        .build()));

    await app.listen(config.APP_PORT);
}

bootstrap();
