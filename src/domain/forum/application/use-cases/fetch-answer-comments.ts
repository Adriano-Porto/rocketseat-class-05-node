import { Either, right } from '@/core/either'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../respositories/answer-comments-repository'

interface FetchAnswerUseCaseInput {
    answerId: string
    page: number
}

type FetchAnswerUseCaseOutput = Either<null, { 
    answerComments: AnswerComment[]
 }>
export class FetchAnswerCommentsUseCase {
    constructor(private answerCommentRepository: AnswerCommentsRepository) {}

    async execute({
        page,
        answerId
    }: FetchAnswerUseCaseInput): Promise<FetchAnswerUseCaseOutput> {
        const answerComments = await this.answerCommentRepository.findManyByAnswerId(answerId, { page })

        return right({ answerComments })
    }
}