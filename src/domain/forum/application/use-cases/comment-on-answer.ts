import { AnswersRespository } from '../respositories/answers-repository'
import { AnswerComment } from '../../enterprise/entities/answer-comment'
import { AnswerCommentsRepository } from '../respositories/answer-comments-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface CommentOnAnswerUseCaseInput {
    authorId: string,
    answerId: string,
    content: string,
}

type CommentOnAnswerUseCaseOutput = Either<ResourceNotFoundError, { 
    answerComment: AnswerComment
 }>
export class CommentOnAnswerUseCase {
    constructor(
        private answersRepository: AnswersRespository,
        private answerCommentsRepository: AnswerCommentsRepository    
    ) {}

    async execute({
        authorId,
        answerId,
        content
    }: CommentOnAnswerUseCaseInput): Promise<CommentOnAnswerUseCaseOutput> {
        const answer = await this.answersRepository.findById(answerId)

        if (!answer) return left(new ResourceNotFoundError())

        await this.answersRepository.create(answer)

        const answerComment = AnswerComment.create({
            authorId: new UniqueEntityID(authorId),
            answerId: new UniqueEntityID(answerId),
            content,
        })

        await this.answerCommentsRepository.create(answerComment)

        return right({ answerComment })
    }
}