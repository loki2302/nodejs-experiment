import { DynamicModule, MiddlewareConsumer, Module, NestModule, Type } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoController } from './todo.controller';
import { LoggerModule } from 'nestjs-pino/dist';
import { DummyMiddleware } from './dummy.middleware';
import { DummyInterceptor } from './dummy.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DummyExceptionFilter } from './dummy-exception.filter';
import { ClientEntity, TodoEntity, TokenEntity, UserEntity } from './entities';
import { OAuthModelService } from './oauthmodel.service';
import ExpressOAuthServer = require('express-oauth-server');

const AllEntities = [TodoEntity, UserEntity, ClientEntity, TokenEntity];

const TypeOrmModuleDefaults = {
    entities: AllEntities,
    synchronize: true,
    logging: true
};

export function makeMysqlDatabaseModule(
    mysqlHost: string,
    mysqlPort: number,
    mysqlUsername: string,
    mysqlPassword: string,
    mysqlDatabase: string): DynamicModule {

    return TypeOrmModule.forRoot({
        ...TypeOrmModuleDefaults,
        type: 'mysql',
        host: mysqlHost,
        port: mysqlPort,
        username: mysqlUsername,
        password: mysqlPassword,
        database: mysqlDatabase
    });
}

export function makeSqliteDatabaseModule(dbName: string): DynamicModule {
    return TypeOrmModule.forRoot({
        ...TypeOrmModuleDefaults,
        type: 'sqlite',
        database: dbName
    });
}

@Module({})
export class AppModule implements NestModule {
    static make(typeOrmModule: Type<any> | DynamicModule, logLevel: string): DynamicModule {
        return {
            module: AppModule,
            imports: [
                ServeStaticModule.forRoot({
                    rootPath: join(__dirname, '..', 'static')
                }),
                LoggerModule.forRoot({
                    name: 'app1',
                    level: logLevel,
                    prettyPrint: true,
                    useLevelLabels: true
                }),
                typeOrmModule,
                TypeOrmModule.forFeature(AllEntities)
            ],
            controllers: [
                AppController,
                TodoController
            ],
            providers: [
                DummyMiddleware,
                {
                    provide: APP_INTERCEPTOR,
                    useClass: DummyInterceptor
                },
                {
                    provide: APP_FILTER,
                    useClass: DummyExceptionFilter
                },
                OAuthModelService,
                {
                    provide: ExpressOAuthServer,
                    inject: [OAuthModelService],
                    useFactory: (oAuthModelService: OAuthModelService) => {
                        return new ExpressOAuthServer({
                            model: oAuthModelService
                        });
                    }
                }
            ]
        };
    }

    constructor(private readonly expressOAuthServer: ExpressOAuthServer) {
    }

    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(DummyMiddleware).forRoutes('*');
        consumer.apply(this.expressOAuthServer.token()).forRoutes('/oauth/token');
        consumer.apply(this.expressOAuthServer.authenticate()).forRoutes(TodoController);
    }
}
