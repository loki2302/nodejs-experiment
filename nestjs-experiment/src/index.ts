import {NestFactory} from "@nestjs/core";
import {Controller, Get, Module} from "@nestjs/common";

@Controller()
class AppController {
    @Get()
    index(): string {
        return 'Hello World!';
    }
}

@Module({
    imports: [],
    controllers: [
        AppController
    ],
    components: []
})
class AppModule {
}

(async () => {
    const app = await NestFactory.create(AppModule);
    await app.listen(3000);
})();
