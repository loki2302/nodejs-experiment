import * as Joi from '@hapi/joi';
import { DbConfig, LogConfig } from './app.module';

export interface Config {
    dbConfig: DbConfig;
    logConfig: LogConfig;
    port: number;
}

export function loadConfig(): Config {
    const config = {
        dbConfig: {
            type: process.env.APP_DB_TYPE,
            mysqlHost: process.env.APP_MYSQL_HOST,
            mysqlPort: process.env.APP_MYSQL_PORT,
            mysqlUsername: process.env.APP_MYSQL_USERNAME,
            mysqlPassword: process.env.APP_MYSQL_PASSWORD,
            mysqlDatabase: process.env.APP_MYSQL_DATABASE,
            dbName: process.env.APP_SQLITE_DATABASE
        } as DbConfig,
        logConfig: {
            mode: process.env.APP_LOG_MODE,
            level: process.env.APP_LOG_LEVEL
        } as LogConfig,
        port: process.env.APP_PORT
    };

    const schema = Joi.object({
        dbConfig: Joi.object({
            type: Joi.string().equal('mysql', 'sqlite').default('sqlite'),
            mysqlHost: Joi.when('type', { is: 'mysql', then: Joi.string().required() }),
            mysqlPort: Joi.when('type', { is: 'mysql', then: Joi.number().required() }),
            mysqlUsername: Joi.when('type', { is: 'mysql', then: Joi.string().required() }),
            mysqlPassword: Joi.when('type', { is: 'mysql', then: Joi.string().required() }),
            mysqlDatabase: Joi.when('type', { is: 'mysql', then: Joi.string().required() }),
            dbName: Joi.when('type', { is: 'sqlite', then: Joi.string().default('db') }),
        }),
        logConfig: Joi.object({
            mode: Joi.string().equal('text', 'json').default('text'),
            level: Joi.string().default('info')
        }),
        port: Joi.number().default(3000)
    });

    const result = schema.validate(config, { abortEarly: false, stripUnknown: true });
    if (result.error) {
        throw new Error(`Config validation error: ${result.error.message}`);
    }

    return result.value;
}
