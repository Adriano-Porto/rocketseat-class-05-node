import { Either, left, right } from '@/core/either'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRespository } from '../respositories/questions-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'

interface GetQuestionBySlugUseCaseInput {
    slug: string
}

type GetQuestionBySlugUseCaseOutput = Either<ResourceNotFoundError, { 
    question: Question
 }>
export class GetQuestionBySlugUseCase {
    constructor(private questionsRepository: QuestionsRespository) {}

    async execute({
        slug
    }: GetQuestionBySlugUseCaseInput): Promise<GetQuestionBySlugUseCaseOutput> {
        const question = await this.questionsRepository.findBySlug(slug)

        if (!question)
            return left(new ResourceNotFoundError())

        return right({ question })
    }
}