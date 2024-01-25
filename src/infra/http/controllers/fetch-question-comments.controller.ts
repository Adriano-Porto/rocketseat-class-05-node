import { BadRequestException, Get, Param, Query } from '@nestjs/common'
import { Controller } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { FetchQuestionCommentsUseCase } from '@/domain/forum/application/use-cases/fetch-question-comments'
import { CommentPresenter } from '../presenters/comment-presenter'

const pageQueryParamSchema = z
    .string()
    .optional()
    .default('1')
    .transform(Number)
    .pipe(z.number().min(1))

const queryValidationPipe = new ZodValidationPipe(
    pageQueryParamSchema
)

type PageQueryParamSchema = z.infer<typeof pageQueryParamSchema>

@Controller('/question/:questionId/comments')
export class FetchQuestionCommentsController {
    constructor(private fetchRecentquestionComments: FetchQuestionCommentsUseCase) {}

    @Get()

    async handle(
        @Query('page', queryValidationPipe) page: PageQueryParamSchema,
        @Param('questionId') questionId: string
    ) {        

        const result = await this.fetchRecentquestionComments.execute({
            page,
            questionId
        })

        if (result.isLeft()){
            throw new BadRequestException()
        }

        const questionComments = result.value.questionComments

        return {
            comments: questionComments.map(CommentPresenter.toHTTP)
        }
    }
}