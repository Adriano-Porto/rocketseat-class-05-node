import { AnswerAttachment } from '../../enterprise/entities/answer-attachment'

export abstract class AnswerAttachmentsRepository {
    abstract createMany(attachments: AnswerAttachment[]): Promise<void>
    abstract deleteMany(attachment: AnswerAttachment[]): Promise<void>
    abstract findManyByAnswerId(questionId: string): Promise<AnswerAttachment[]>
    abstract deleteManyByAnswerId(questionId: string): Promise<void>
}