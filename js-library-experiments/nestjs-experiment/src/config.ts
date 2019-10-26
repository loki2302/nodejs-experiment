import * as Joi from '@hapi/joi';

export interface AppConfig {
    APP_MYSQL_HOST: string;
    APP_MYSQL_PORT: number;
    APP_MYSQL_USERNAME: string;
    APP_MYSQL_PASSWORD: string;
    APP_MYSQL_DATABASE: string;
}

export function loadConfig(): AppConfig {
    const schema = Joi.object({
        APP_MYSQL_HOST: Joi.string().required(),
        APP_MYSQL_PORT: Joi.number().required(),
        APP_MYSQL_USERNAME: Joi.string().required(),
        APP_MYSQL_PASSWORD: Joi.string().required(),
        APP_MYSQL_DATABASE: Joi.string().required()
    });

    const result = schema.validate(process.env, { abortEarly: false, stripUnknown: true });
    if (result.error) {
        throw new Error(`Config validation error: ${result.error.message}`);
    }

    return result.value;
}
