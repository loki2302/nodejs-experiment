import { Logger as TypeOrmLogger, QueryRunner } from 'typeorm';
import { Logger as WinstonLogger } from 'winston';

export class WinstonTypeOrmLogger implements TypeOrmLogger {
    constructor(private readonly winstonLogger: WinstonLogger) {
    }

    log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner): any {
        this.winstonLogger.info(message);
    }

    logMigration(message: string, queryRunner?: QueryRunner): any {
        this.winstonLogger.info(message);
    }

    logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.winstonLogger.info(query, { parameters });
    }

    logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.winstonLogger.error(error, { query, parameters });
    }

    logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner): any {
        this.winstonLogger.warn('slow', { time, query, parameters });
    }

    logSchemaBuild(message: string, queryRunner?: QueryRunner): any {
        this.winstonLogger.info(message);
    }
}
