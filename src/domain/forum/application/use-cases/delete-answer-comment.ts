import { Either, left, right } from '@/core/either'
import { AnswerCommentsRepository } from '../respositories/answer-comments-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

interface DeleteAnswerCommentUseCaseInput {
    authorId: string,
    answerCommentId: string,
}

type DeleteAnswerCommentUseCaseOutput = Either<ResourceNotFoundError | NotAllowedError, Record<string, never>>

export class DeleteAnswerCommentUseCase {
    constructor(
        private answerCommentsRepository: AnswerCommentsRepository    
    ) {}

    async execute({
        authorId,
        answerCommentId,
    }: DeleteAnswerCommentUseCaseInput): Promise<DeleteAnswerCommentUseCaseOutput> {
        const answerComment = await this.answerCommentsRepository.findById(answerCommentId)

        if (!answerComment)
            return left(new ResourceNotFoundError()) 

        if( answerComment.authorId.toString() !== authorId )
            return left(new NotAllowedError())

        await this.answerCommentsRepository.delete(answerComment)
        return right({})
    }
}