import { Either, right } from '@/core/either'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../respositories/question-comments-repository'
import { Injectable } from '@nestjs/common'

interface FetchQuestionUseCaseInput {
    questionId: string
    page: number
}

type FetchQuestionUseCaseOutput = Either<null, { 
    questionComments: QuestionComment[]
 }>

@Injectable()
export class FetchQuestionCommentsUseCase {
    constructor(private questionCommentRepository: QuestionCommentsRepository) {}

    async execute({
        page,
        questionId
    }: FetchQuestionUseCaseInput): Promise<FetchQuestionUseCaseOutput> {
        const questionComments = await this.questionCommentRepository.findManyByQuestionId(questionId, { page })

        return right({ questionComments })
    }
}