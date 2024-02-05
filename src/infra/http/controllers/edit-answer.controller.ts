import { BadRequestException, Body, HttpCode, Param, Put } from '@nestjs/common'
import { Controller } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'

const editAnswerBodySchema = z.object({
    content: z.string(),
    attachments: z.array(z.string().uuid()).default([])
})

type EditAnswerBodySchema = z.infer<typeof editAnswerBodySchema>


@Controller('/answers/:id')
export class EditAnswerController {

    constructor(private editAnswer: EditAnswerUseCase) {}

    @Put()
    @HttpCode(204)
    // async handle(@Request() request: Request) {}
    async handle(
        @Body(new ZodValidationPipe(editAnswerBodySchema)) body: EditAnswerBodySchema,
        @CurrentUser() user: UserPayload,
        @Param('id') answerId: string
    ) {
        const { content, attachments } = body
        const { sub: authorId } = user


        const result = await this.editAnswer.execute({
            content,
            authorId,
            attachmentsIds: attachments,
            answerId
        })

        if(result.isLeft()) {
            throw new BadRequestException()
        }
    }
}