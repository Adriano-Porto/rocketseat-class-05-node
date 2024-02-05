import { Body, Param } from '@nestjs/common'
import { Controller, Post } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'

const answerQuestionBodySchema = z.object({
    content: z.string(),
    attachments: z.array(z.string().uuid())

})

type AnswerQuestionBodySchema = z.infer<typeof answerQuestionBodySchema>


@Controller('/questions/:questionId/answers')
export class AnswerQuestionController {

    constructor(private answerQuestion: AnswerQuestionUseCase) {}

    @Post()
    // async handle(@Request() request: Request) {} get request related information
    async handle(
        @Body(new ZodValidationPipe(answerQuestionBodySchema)) body: AnswerQuestionBodySchema,
        @Param('questionId') questionId: string,
        @CurrentUser() user: UserPayload
    ) {
        const { content, attachments } = body
        const { sub: authorId } = user


        await this.answerQuestion.execute({
            authorId,
            questionId,
            content,
            attachmentsIds: attachments,
        })
    }
}