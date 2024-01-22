import { BadRequestException, PipeTransform } from '@nestjs/common'
import { ZodError, ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodSchema) {}

    transform(value: any) {
        try {
            return this.schema.parse(value)
        } catch (error) {
            if (error instanceof ZodError) throw new BadRequestException({
                errors: fromZodError(error),
                statusCode: 409,
                message: 'Validation Failed'
            })
 
            throw new BadRequestException('Validation Failed')
        }

        return value
    }
}