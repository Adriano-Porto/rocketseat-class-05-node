import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionAttachment, QuestionAttachmentProps } from '@/domain/forum/enterprise/entities/question-attachment'

export async function makeQuestionAttachment(override: Partial<QuestionAttachmentProps> = {}, id?: UniqueEntityID) {
    const questionattachment = await QuestionAttachment.create({
        questionId: new UniqueEntityID(),
        attachmentId: new UniqueEntityID(),
        ...override
    }, id)

    return questionattachment
}