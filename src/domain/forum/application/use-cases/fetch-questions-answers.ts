import { Either, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRespository } from '../respositories/answers-repository'

interface FetchQuestionAnswersUseCaseInput {
    questionId: string
    page: number
}

type FetchQuestionAnswersUseCaseOutput = Either<null, { 
    answers: Answer[]
 }>
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