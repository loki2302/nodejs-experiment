import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { Response } from 'express';

@Injectable()
export class DummyInterceptor implements NestInterceptor {
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        const httpArgumentsHost = context.switchToHttp();
        const request = httpArgumentsHost.getRequest<Request>();
        const response = httpArgumentsHost.getRequest<Response>();

        console.log(
            `DummyInterceptor::before controller=${context.getClass().name}, method=${context.getHandler().name}, ` +
            `request=${request.method} ${request.url}`);

        let handlerReturnValue: any;
        try {
            handlerReturnValue = await next.handle().toPromise();
            return of(handlerReturnValue);
        } finally {
            // at this point the status is not available yet
            console.log(`DummyInterceptor::after return=${JSON.stringify(handlerReturnValue)} status=${response.statusCode}`);
        }
    }
}
