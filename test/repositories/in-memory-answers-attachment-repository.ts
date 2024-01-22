import { AnswerAttachmentsRepository } from '@/domain/forum/application/respositories/answer-attachments-repository'
import { AnswerAttachment } from '@/domain/forum/enterprise/entities/answer-attachment'

export class InMemoryAnswerAttachmentRepository implements AnswerAttachmentsRepository {
    public items: AnswerAttachment[] = []

    async findManyByAnswerId(answerId: string): Promise<AnswerAttachment[]> {
        const answerAttachment = this.items.filter(
            (item) => item.answerId.toString() === answerId
            
        )   
        return answerAttachment
    }

    async deleteManyByAnswerId(answerId: string) {
        const answerAttachments = this.items.filter(
            (item) => item.answerId.toString() !== answerId,
        )

        this.items = answerAttachments
    }
}