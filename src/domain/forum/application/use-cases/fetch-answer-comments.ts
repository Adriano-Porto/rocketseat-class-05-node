import { Either, right } from '@/core/either'
import { AnswerCommentsRepository } from '../respositories/answer-comments-repository'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

interface FetchAnswerUseCaseInput {
    answerId: string
    page: number
}

type FetchAnswerUseCaseOutput = Either<null, { 
    comments: CommentWithAuthor[]
 }>

@Injectable()
export class FetchAnswerCommentsUseCase {
    constructor(private answerCommentRepository: AnswerCommentsRepository) {}

    async execute({
        page,
        answerId
    }: FetchAnswerUseCaseInput): Promise<FetchAnswerUseCaseOutput> {
        const comments = await this.answerCommentRepository.findManyByAnswerIdWithAuthor(answerId, { page })

        return right({ comments })
    }
}