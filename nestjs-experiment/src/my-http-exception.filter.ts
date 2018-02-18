import {Catch, ExceptionFilter, HttpException} from "@nestjs/common";
import * as express from "express";

@Catch(HttpException)
export class MyHttpExceptionFilter implements ExceptionFilter {
    catch(exception: HttpException, response: express.Response): any {
        const status = exception.getStatus();
        const message = exception.getResponse();

        response
            .status(status)
            .json({
                myStatusCode: status,
                myMessage: message
            });
    }
}
