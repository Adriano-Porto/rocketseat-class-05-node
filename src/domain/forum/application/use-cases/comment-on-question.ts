import { QuestionsRespository } from '../respositories/questions-repository'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../respositories/question-comments-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Either, left, right } from '@/core/either'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface CommentOnQuestionUseCaseInput {
    authorId: string,
    questionId: string,
    content: string,
}

type CommentOnQuestionUseCaseOutput = Either<ResourceNotFoundError, { 
    questionComment: QuestionComment
 }>
export class CommentOnQuestionUseCase {
    constructor(
        private questionsRepository: QuestionsRespository,
        private questionCommentsRepository: QuestionCommentsRepository    
    ) {}

    async execute({
        authorId,
        questionId,
        content
    }: CommentOnQuestionUseCaseInput): Promise<CommentOnQuestionUseCaseOutput> {
        const question = await this.questionsRepository.findById(questionId)

        if (!question) return left(new ResourceNotFoundError())

        await this.questionsRepository.create(question)

        const questionComment = QuestionComment.create({
            authorId: new UniqueEntityID(authorId),
            questionId: new UniqueEntityID(questionId),
            content,
        })

        await this.questionCommentsRepository.create(questionComment)

        return right({ questionComment })
    }
}