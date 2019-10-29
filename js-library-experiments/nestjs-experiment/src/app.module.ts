import { DynamicModule, MiddlewareConsumer, Module, NestModule, Type } from '@nestjs/common';
import { AppController } from './app.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TodoController } from './todo.controller';
import { DummyMiddleware } from './dummy.middleware';
import { DummyInterceptor } from './dummy.interceptor';
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { DummyExceptionFilter } from './dummy-exception.filter';
import { ClientEntity, TodoEntity, TokenEntity, UserEntity } from './entities';
import { OAuthModelService } from './oauthmodel.service';
import ExpressOAuthServer = require('express-oauth-server');
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import * as ExpressCtx from 'express-ctx';
import { InjectRequestContextFormat, SetRequestContextMiddleware } from './logging';
import { Format } from 'logform';

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

export function makeLoggingModule(mode: 'text'|'json', level: string): DynamicModule {
    let formatters: Format[] = [
        new InjectRequestContextFormat(),
        winston.format.timestamp(),
    ];
    if (mode === 'text') {
        formatters = [
            ...formatters,
            winston.format.printf(i => {
                const rest = JSON.stringify(Object.assign({}, i, {
                    level: undefined,
                    message: undefined,
                    timestamp: undefined
                }));
                return `${i.timestamp} ${i.level}: ${i.message} <${rest}>`;
            })
        ];
    } else if (mode === 'json') {
        formatters = [
            ...formatters,
            winston.format.logstash()
        ];
    }

    return WinstonModule.forRoot({
        level,
        format: winston.format.combine(...formatters),
        transports: [
            new winston.transports.Console()
        ]
    });
}

@Module({})
export class AppModule implements NestModule {
    static make(
        typeOrmModule: Type<any> | DynamicModule,
        loggingModule: Type<any> | DynamicModule): DynamicModule {

        return {
            module: AppModule,
            imports: [
                ServeStaticModule.forRoot({
                    rootPath: join(__dirname, '..', 'static')
                }),
                typeOrmModule,
                TypeOrmModule.forFeature(AllEntities),
                loggingModule
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
                },
                SetRequestContextMiddleware
            ]
        };
    }

    constructor(private readonly expressOAuthServer: ExpressOAuthServer) {
    }

    configure(consumer: MiddlewareConsumer): any {
        consumer.apply(ExpressCtx.middleware, SetRequestContextMiddleware).forRoutes('*');
        consumer.apply(DummyMiddleware).forRoutes('*');
        consumer.apply(this.expressOAuthServer.token()).forRoutes('/oauth/token');
        consumer.apply(this.expressOAuthServer.authenticate()).forRoutes(TodoController);
    }
}
