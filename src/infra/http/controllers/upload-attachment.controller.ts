import { InvalidAttachmentTypeError } from '@/domain/forum/application/use-cases/errors/invalid-attachment-type'
import { UploadAndCreateAttachmentUseCase } from '@/domain/forum/application/use-cases/upload-and-create-attachment'
import { BadRequestException, FileTypeValidator, HttpCode, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { Controller } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('/attachments')
export class UploadAttachmentController {
    constructor(
        private uploadAndCreateAttachmentUseCase: UploadAndCreateAttachmentUseCase
    ) {}

    @Post()
    @HttpCode(201)
    @UseInterceptors(FileInterceptor('file'))
    async handle(@UploadedFile(
        new ParseFilePipe({
            validators: [
                new MaxFileSizeValidator({
                    maxSize: 1024 * 1024 * 2 // 2 megabytes
                }),
                new FileTypeValidator({fileType: '.(png|jpg|jpeg|pdf)'})
            ],
        }),
    )
        file: Express.Multer.File ) {        
        const result = await this.uploadAndCreateAttachmentUseCase.execute({
            fileName: file.originalname,
            fileType: file.mimetype,
            body: file.buffer
        })
        
        if(result.isLeft()) {
            const error = result.value

            switch(error.constructor) {
            case InvalidAttachmentTypeError:
                throw new BadRequestException(error.message)
            default: 
                throw new BadRequestException(error.message)
            }
        }

        const { attachment } = result.value

        return {
            attachmentId: attachment.id.toString()
        }
    }
}