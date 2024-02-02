import { Attachment } from '@/domain/forum/enterprise/entities/Attachment'
import { Prisma} from '@prisma/client'

export class PrismaAttachmentMapper {
    static toPrisma(attachment: Attachment): Prisma.AttachmentUncheckedCreateInput {
        return {
            id: attachment.id.toString(),
            title: attachment.title,
            url: attachment. title,
        }
    }
}