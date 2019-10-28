import * as Joi from '@hapi/joi';

export interface MysqlDbConfig {
    APP_DB_TYPE: 'mysql';
    APP_MYSQL_HOST: string;
    APP_MYSQL_PORT: number;
    APP_MYSQL_USERNAME: string;
    APP_MYSQL_PASSWORD: string;
    APP_MYSQL_DATABASE: string;
}

export interface SqliteDbConfig {
    APP_DB_TYPE: 'sqlite';
    APP_SQLITE_DATABASE: string;
}

export type DbConfig = MysqlDbConfig | SqliteDbConfig;

export interface WebConfig {
    APP_PORT: number;
}

export interface LogConfig {
    APP_LOG_LEVEL: string;
}

export type AppConfig = DbConfig & WebConfig & LogConfig;

export function loadConfig(): AppConfig {
    const schema = Joi.object({
        APP_DB_TYPE: Joi.string().equal('mysql', 'sqlite').default('sqlite'),
        APP_MYSQL_HOST: Joi.when('APP_DB_TYPE', { is: 'mysql', then: Joi.string().required() }),
        APP_MYSQL_PORT: Joi.when('APP_DB_TYPE', { is: 'mysql', then: Joi.number().required() }),
        APP_MYSQL_USERNAME: Joi.when('APP_DB_TYPE', { is: 'mysql', then: Joi.string().required() }),
        APP_MYSQL_PASSWORD: Joi.when('APP_DB_TYPE', { is: 'mysql', then: Joi.string().required() }),
        APP_MYSQL_DATABASE: Joi.when('APP_DB_TYPE', { is: 'mysql', then: Joi.string().required() }),
        APP_SQLITE_DATABASE: Joi.when('APP_DB_TYPE', { is: 'sqlite', then: Joi.string().default('db') }),
        APP_PORT: Joi.number().default(3000),
        APP_LOG_LEVEL: Joi.string().default('info')
    });

    const result = schema.validate(process.env, { abortEarly: false, stripUnknown: true });
    if (result.error) {
        throw new Error(`Config validation error: ${result.error.message}`);
    }

    console.log('CONFIG', JSON.stringify(result.value, null, 2));

    return result.value;
}
