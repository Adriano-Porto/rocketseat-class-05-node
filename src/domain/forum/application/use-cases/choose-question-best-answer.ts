import { Question } from '../../enterprise/entities/question'
import { QuestionsRespository } from '../respositories/questions-repository'
import { AnswersRespository } from '../respositories/answers-repository'
import { Either, left, right } from '@/core/either'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { Injectable } from '@nestjs/common'

interface ChooseQuestionBestAnswerUseCaseInput {
    authorId: string,
    answerId: string,
}

type ChooseQuestionBestAnswerUseCaseOutput = Either<
    ResourceNotFoundError | NotAllowedError
, { 
    question: Question
 }>

 @Injectable()
export class ChooseQuestionBestAnswerUseCase {
    constructor(
        private questionsRepository: QuestionsRespository,
        private answersRepository: AnswersRespository,
    ) {}

    async execute({
        authorId,
        answerId,
    }: ChooseQuestionBestAnswerUseCaseInput): Promise<ChooseQuestionBestAnswerUseCaseOutput> {
        const answer = await this.answersRepository.findById(answerId)

        if (!answer) return left(new ResourceNotFoundError())

        const question = await this.questionsRepository.findById(answer.questionId.toString())

        if (!question) {
            return left(new ResourceNotFoundError())
        }

        if (authorId !== question.authorId.toString())
            return left(new NotAllowedError())

        question.bestAnswerId = answer.id

        await this.questionsRepository.save(question)


        return right({ question })
    }
}