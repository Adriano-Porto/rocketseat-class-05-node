import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Attachment, AttachmentProps } from '@/domain/forum/enterprise/entities/attachment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaAttachmentMapper } from '@/infra/database/prisma/mappers/prisma-attachments-mapper'

export async function makeAttachment(override: Partial<AttachmentProps> = {}, id?: UniqueEntityID) {
    const attachment = await Attachment.create({
        title: faker.lorem.slug(),
        url: faker.internet.url(),
        ...override
    }, id)

    return attachment
}

@Injectable()
export class AttachmentFactory {
    constructor(private prisma: PrismaService) {}

    async makePrismaAttachment (data: Partial<AttachmentProps> = {}): Promise<Attachment> {
        const attachment = await makeAttachment(data)

        await this.prisma.attachment.create({
            data: PrismaAttachmentMapper.toPrisma(attachment)
        })

        return attachment
    }
} 