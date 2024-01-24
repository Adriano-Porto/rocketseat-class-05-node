import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRespository } from '../respositories/answers-repository'
import { Injectable } from '@nestjs/common'

interface FetchQuestionAnswersUseCaseInput {
    questionId: string
    page: number
}

type FetchQuestionAnswersUseCaseOutput = Either<null, { 
    answers: Answer[]
 }>

 @Injectable()
export class FetchQuestionAnswersUseCase {
    constructor(private answersRepository: AnswersRespository) {}

    async execute({
        page,
        questionId
    }: FetchQuestionAnswersUseCaseInput): Promise<FetchQuestionAnswersUseCaseOutput> {
        const answers = await this.answersRepository.findManyByQuestionId(questionId, { page })

        return right({ answers })
    }
}