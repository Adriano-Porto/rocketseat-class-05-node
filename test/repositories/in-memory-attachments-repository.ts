import { AttachmentRepository } from '@/domain/forum/application/respositories/attachments-repository'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'

export class InMemoryAttachmentsRepository implements AttachmentRepository {
    public items: Attachment[] = []
    
    constructor (
    ) {}
    async create(attachment: Attachment): Promise<void> {
        this.items.push(attachment)        
    }
}
