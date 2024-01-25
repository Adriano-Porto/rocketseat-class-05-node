import { BadRequestException, Delete, HttpCode, Param } from '@nestjs/common'
import { Controller } from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteQuestionCommentUseCase } from '@/domain/forum/application/use-cases/delete-question-comment'


@Controller('/question/comments/:id')
export class DeleteQuestionCommentController {

    constructor(private deleteQuestionCommentUseCase: DeleteQuestionCommentUseCase) {}

    @Delete()
    @HttpCode(204)
    // async handle(@Request() request: Request) {}
    async handle(
        @CurrentUser() user: UserPayload,
        @Param('id') questionCommentId: string
    ) {
        const { sub: authorId } = user


        const result = await this.deleteQuestionCommentUseCase.execute({
            questionCommentId,
            authorId
        })

        if(result.isLeft()) {
            throw new BadRequestException()
        }
    }
}