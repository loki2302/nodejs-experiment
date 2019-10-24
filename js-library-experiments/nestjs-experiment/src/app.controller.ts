import { Controller, Get } from '@nestjs/common';
import { DummyException } from './dummy.exception';

@Controller()
export class AppController {
    @Get('throw')
    getHello(): string {
        throw new DummyException('Something terrible happened!');
    }
}
