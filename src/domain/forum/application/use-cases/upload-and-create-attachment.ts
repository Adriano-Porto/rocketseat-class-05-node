import { Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { InvalidAttachmentTypeError } from './errors/invalid-attachment-type'
import { Attachment } from '../../enterprise/entities/attachment'
import { AttachmentRepository } from '../respositories/attachments-repository'
import { Uploader } from '@/infra/storage/uploader'

interface UploadAndCreateAttachmentUseCaseInput {
    fileName: string
    fileType: string
    body: Buffer
}

type UploadAndCreateAttachmentUseCaseOutput = Either<InvalidAttachmentTypeError, { 
    attachment: Attachment
 }>

@Injectable()
export class UploadAndCreateAttachmentUseCase {
    constructor(
        private attachmentsRepository: AttachmentRepository,
        private uploader: Uploader
    ) {}

    async execute({
        fileName,
        fileType,
        body
    }: UploadAndCreateAttachmentUseCaseInput): Promise<UploadAndCreateAttachmentUseCaseOutput> {
        if (!/^image\/(jpeg|jpg|png)$|^application\/pdf$/.test(fileType))
            return left (new InvalidAttachmentTypeError(fileType))
        
        const { url } = await this.uploader.upload({
            fileName,
            fileType,
            body
        })
        const attachment = Attachment.create({
            title: fileName, 
            url
        })


        await this.attachmentsRepository.create(attachment)

        return right ({
            attachment
        })
    }
}