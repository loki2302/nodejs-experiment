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
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { Logger } from 'winston';
import * as ExpressCtx from 'express-ctx';
import { InjectRequestContextFormat, SetRequestContextMiddleware } from './logging';
import { Format } from 'logform';
import ExpressOAuthServer = require('express-oauth-server');
import { WinstonTypeOrmLogger } from './winston-typeorm-logger';

const AllEntities = [TodoEntity, UserEntity, ClientEntity, TokenEntity];

export interface MysqlTypeOrmDetails {
    type: 'mysql';
    mysqlHost: string;
    mysqlPort: number;
    mysqlUsername: string;
    mysqlPassword: string;
    mysqlDatabase: string;
}

export interface SqliteTypeOrmDetails {
    type: 'sqlite';
    dbName: string;
}

export type DbConfig = MysqlTypeOrmDetails | SqliteTypeOrmDetails;

export function makeTypeOrmModule(dbConfig: DbConfig): DynamicModule {
    let dbTypeSpecificAttributes: any;
    if (dbConfig.type === 'mysql') {
        dbTypeSpecificAttributes = {
            type: 'mysql',
            host: dbConfig.mysqlHost,
            port: dbConfig.mysqlPort,
            username: dbConfig.mysqlUsername,
            password: dbConfig.mysqlPassword,
            database: dbConfig.mysqlDatabase,
        };
    } else if (dbConfig.type === 'sqlite') {
        dbTypeSpecificAttributes = {
            type: 'sqlite',
            database: dbConfig.dbName
        };
    } else {
        const exhaustiveCheck: never = dbConfig;
    }

    return TypeOrmModule.forRootAsync({
        inject: ['winston'],
        useFactory: (winstonLogger: Logger) => {
            return {
                ...dbTypeSpecificAttributes,
                entities: AllEntities,
                synchronize: true,
                logging: ['query', 'schema', 'error', 'warn', 'info', 'log', 'migration'],
                logger: new WinstonTypeOrmLogger(winstonLogger)
            };
        }
    });
}

export interface LogConfig {
    mode: 'text' | 'json';
    level: string;
}

export function makeWinstonModule(logConfig: LogConfig): DynamicModule {
    let formatters: Format[] = [
        new InjectRequestContextFormat(),
        winston.format.timestamp()
    ];
    if (logConfig.mode === 'text') {
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
    } else if (logConfig.mode === 'json') {
        formatters = [
            ...formatters,
            winston.format.logstash()
        ];
    } else {
        const exhaustiveCheck: never = logConfig.mode;
    }

    return WinstonModule.forRoot({
        level: logConfig.level,
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
        winstonModule: Type<any> | DynamicModule): DynamicModule {

        return {
            module: AppModule,
            imports: [
                ServeStaticModule.forRoot({
                    rootPath: join(__dirname, '..', 'static')
                }),
                typeOrmModule,
                TypeOrmModule.forFeature(AllEntities),
                winstonModule
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
