import { Injectable, NestMiddleware } from '@nestjs/common';

// This only gets executed _before_ the controller
@Injectable()
export class DummyMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: () => void): any {
        console.log('Dummy middleware', req.method, req.url);
        next();
    }
}
