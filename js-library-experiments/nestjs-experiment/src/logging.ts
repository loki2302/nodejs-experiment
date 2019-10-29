import { Injectable, NestMiddleware } from '@nestjs/common';
import * as ExpressCtx from 'express-ctx';
import * as express from 'express';
import { IncomingMessage } from 'http';
import { Format, TransformableInfo } from 'logform';

@Injectable()
export class SetRequestContextMiddleware implements NestMiddleware {
    use(req: IncomingMessage, res: express.Response, next: () => void): any {
        ExpressCtx.setValue('RequestContext', {
            method: req.method,
            url: (req as any).originalUrl
        });
        next();
    }
}

export class InjectRequestContextFormat implements Format {
    transform(info: TransformableInfo, opts?: any): TransformableInfo {
        const requestContext = ExpressCtx.getValue('RequestContext');
        return Object.assign(info, requestContext);
    }
}
