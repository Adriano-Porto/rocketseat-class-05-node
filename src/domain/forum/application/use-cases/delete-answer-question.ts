import { Either, left, right } from '@/core/either'
import { AnswersRespository } from '../respositories/answers-repository'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { Injectable } from '@nestjs/common'

interface DeleteAnswerUseCaseInput {
    answerId: string
    authorId: string
}


type DeleteAnswerUseCaseOutput = Either<
ResourceNotFoundError | NotAllowedError, Record<string, never>>
@Injectable()
export class DeleteAnswerUseCase {
    constructor(private answersRepository: AnswersRespository) {}

    async execute({
        answerId,
        authorId
    }: DeleteAnswerUseCaseInput): Promise<DeleteAnswerUseCaseOutput> {
        const answer = await this.answersRepository.findById(answerId)

        if (!answer) return left(new ResourceNotFoundError())

        if(authorId !== answer.authorId.toString())
            return left(new NotAllowedError())

        await this.answersRepository.delete(answer)

        return right({})
    }
}