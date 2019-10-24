import { Response } from 'express';
import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { DummyException } from './dummy.exception';

@Catch(DummyException)
export class DummyExceptionFilter implements ExceptionFilter<DummyException> {
    catch(exception: DummyException, host: ArgumentsHost): any {
        const httpArgumentsHost = host.switchToHttp();
        const response = (httpArgumentsHost.getRequest<any>().res as Response); // wtf?

        response.status(500).json({
            message: `Dummy exception handler: ${exception}`
        });
    }
}
