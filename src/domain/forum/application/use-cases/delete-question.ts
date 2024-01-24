import { Either, left, right } from '@/core/either'
import { QuestionsRespository } from '../respositories/questions-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteQuestionUseCaseInput {
    questionId: string
    authorId: string
}

type DeleteQuestionUseCaseOutput = Either<
ResourceNotFoundError | NotAllowedError, Record<string, never>>

@Injectable()
export class DeleteQuestionUseCase {
    constructor(private questionsRepository: QuestionsRespository) {}

    async execute({
        questionId,
        authorId
    }: DeleteQuestionUseCaseInput): Promise<DeleteQuestionUseCaseOutput> {
        const question = await this.questionsRepository.findById(questionId)

        if (!question) return left(new ResourceNotFoundError())

        if(authorId !== question.authorId.toString())
            return left(new NotAllowedError())

        await this.questionsRepository.delete(question)

        return right({})
    }
}