import {ArgumentMetadata, HttpException, HttpStatus, Pipe, PipeTransform} from "@nestjs/common";
import {validate} from "class-validator";
import {plainToClass} from "class-transformer";

@Pipe()
export class MyValidationPipe implements PipeTransform<any> {
    async transform(value: any, metadata: ArgumentMetadata) {
        const { metatype } = metadata;
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = plainToClass(metatype, value);
        const errors = await validate(object);
        if (errors.length > 0) {
            console.log('Got these validation errors: ', errors);
            throw new HttpException('Validation failed', HttpStatus.BAD_REQUEST);
        }
        return value;
    }

    private toValidate(metatype: any): boolean {
        const types = [String, Boolean, Number, Array, Object];
        return !types.find(type => metatype === type);
    }
}
