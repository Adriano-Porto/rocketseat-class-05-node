import { Either, left, right } from '@/core/either'
import { QuestionCommentsRepository } from '../respositories/question-comments-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface DeleteQuestionCommentUseCaseInput {
    authorId: string,
    questionCommentId: string,
}

type DeleteQuestionCommentUseCaseOutput = Either<
ResourceNotFoundError | NotAllowedError, Record<string, never>>
export class DeleteQuestionCommentUseCase {
    constructor(
        private questionCommentsRepository: QuestionCommentsRepository    
    ) {}

    async execute({
        authorId,
        questionCommentId,
    }: DeleteQuestionCommentUseCaseInput): Promise<DeleteQuestionCommentUseCaseOutput> {
        const questionComment = await this.questionCommentsRepository.findById(questionCommentId)

        if (!questionComment)
            return left(new ResourceNotFoundError())

        if( questionComment.authorId.toString() !== authorId ) {
            return left(new NotAllowedError())
        }

        await this.questionCommentsRepository.delete(questionComment)
        return right({})
    }
}