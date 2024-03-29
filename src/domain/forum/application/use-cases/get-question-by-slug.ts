import { Either, left, right } from '@/core/either'
import { QuestionsRespository } from '../respositories/questions-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'
import { QuestionDetails } from '../../enterprise/entities/value-objects/question-details'

interface GetQuestionBySlugUseCaseInput {
    slug: string
}

type GetQuestionBySlugUseCaseOutput = Either<ResourceNotFoundError, { 
    question: QuestionDetails
 }>

@Injectable()
export class GetQuestionBySlugUseCase {
    constructor(private questionsRepository: QuestionsRespository) {}

    async execute({
        slug
    }: GetQuestionBySlugUseCaseInput): Promise<GetQuestionBySlugUseCaseOutput> {
        const question = await this.questionsRepository.findDetailsBySlug(slug)

        if (!question)
            return left(new ResourceNotFoundError())

        return right({ question })
    }
}