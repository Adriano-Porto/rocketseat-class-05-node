import { FileTypeValidator, HttpCode, MaxFileSizeValidator, ParseFilePipe, Post, UploadedFile, UseInterceptors } from '@nestjs/common'
import { Controller } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'

@Controller('/attachments')
export class UploadAttachmentController {
    // constructor() {}

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
        console.log('file received: ')
        console.log(file)

        // if (result.isLeft()){
        //     throw new BadRequestException()
        // }

        return {
            
        }
    }
}