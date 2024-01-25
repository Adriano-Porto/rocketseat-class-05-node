import { Body, Param } from '@nestjs/common'
import { Controller, Post } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { CommentOnAnswerUseCase } from '@/domain/forum/application/use-cases/comment-on-answer'

const commentOnAnswerBodySchema = z.object({
    content: z.string(),

})

type CommentOnAnswerBodySchema = z.infer<typeof commentOnAnswerBodySchema>


@Controller('/answers/:answerId/comments')
export class CommentOnAnswerController {

    constructor(private commentOnAnswer: CommentOnAnswerUseCase) {}

    @Post()
    async handle(
        @Body(new ZodValidationPipe(commentOnAnswerBodySchema)) body: CommentOnAnswerBodySchema,
        @Param('answerId') answerId: string,
        @CurrentUser() user: UserPayload
    ) {
        const { content } = body
        const { sub: authorId } = user


        await this.commentOnAnswer.execute({
            authorId,
            answerId,
            content,
        })
    }
}