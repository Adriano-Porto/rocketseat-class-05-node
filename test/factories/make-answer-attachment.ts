import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswerAttachment, AnswerAttachmentProps } from '@/domain/forum/enterprise/entities/answer-attachment'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { Injectable } from '@nestjs/common'

export async function makeAnswerAttachment(override: Partial<AnswerAttachmentProps> = {}, id?: UniqueEntityID) {
    const answerattachment = await AnswerAttachment.create({
        answerId: new UniqueEntityID(),
        attachmentId: new UniqueEntityID(),
        ...override
    }, id)

    return answerattachment
}

@Injectable()
export class AnswerAttachmentFactory {
    constructor(private prisma: PrismaService) {}

    async makePrismaAnswerAttachment (
        data: Partial<AnswerAttachmentProps> = {}
    ): Promise<AnswerAttachment> {
        const answerAttachment = await makeAnswerAttachment(data)

        await this.prisma.attachment.update({
            where: {
                id: answerAttachment.attachmentId.toString()
            }, data: {
                answerId: answerAttachment.answerId.toString()
            }
        })

        return answerAttachment
    }
} 