import { Either, left, right } from '@/core/either'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRespository } from '../respositories/answers-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/core/errors/errors/resource-not-found-error'
import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'
import { AnswerAttachmentList } from '../../enterprise/entities/answer-attachment-list'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerAttachmentsRepository } from '../respositories/answer-attachments-repository'
import { Injectable } from '@nestjs/common'

interface EditAnswerUseCaseInput {
    authorId: string
    answerId: string
    content: string
    attachmentsIds: string[]
}

type EditAnswerUseCaseOutput = Either<
ResourceNotFoundError | NotAllowedError, { 
    answer: Answer
 }>

@Injectable()
export class EditAnswerUseCase {
    constructor(
        private answersRepository: AnswersRespository,
        private answerAttachmentsRepository: AnswerAttachmentsRepository
    ) {}

    async execute({
        authorId,
        content,
        answerId,
        attachmentsIds
    }: EditAnswerUseCaseInput): Promise<EditAnswerUseCaseOutput> {
        const answer = await this.answersRepository.findById(answerId)

        if (!answer)
            return left(new ResourceNotFoundError())

        if(authorId !== answer.authorId.toString())
            return left(new NotAllowedError())


        const currentAnswerAttachments = await this.answerAttachmentsRepository.findManyByAnswerId(answerId)

        const answerAttachmentList = new AnswerAttachmentList(currentAnswerAttachments)

        const answerAttachments = attachmentsIds.map((attachmentId) => {
            return AnswerAttachment.create({
                attachmentId: new UniqueEntityID(attachmentId),
                answerId: answer.id
            })
        })
    
        answerAttachmentList.update(answerAttachments)

        answer.attachments = answerAttachmentList
        answer.content = content

        await this.answersRepository.save(answer)

        return right({ answer })
    }
}