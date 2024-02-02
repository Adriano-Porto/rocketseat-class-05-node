import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { PrismaService } from '../prisma.service'
import { Injectable } from '@nestjs/common'
import { AttachmentRepository } from '@/domain/forum/application/respositories/attachments-repository'
import { PrismaAttachmentMapper } from '../mappers/prisma-attachments-mapper'

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentRepository {
    constructor(private prisma: PrismaService) {}

    async create(attachment: Attachment): Promise<void> {
        await this.prisma.attachment.create({
            data: PrismaAttachmentMapper.toPrisma(attachment)
        })
    }

}