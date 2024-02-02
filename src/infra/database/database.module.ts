import { Module } from '@nestjs/common'
import { PrismaService } from './prisma/prisma.service'
import { PrismaQuestionsRepository } from './prisma/repositories/prisma-questions-repository'
import { PrismaQuestionAttachmentsRepository } from './prisma/repositories/prisma-question-attachments-repository'
import { PrismaQuestionCommentsRepository } from './prisma/repositories/prisma-question-comments-repository'
import { PrismaAnswerAttachmentsRepository } from './prisma/repositories/prisma-answer-attachments-repository'
import { PrismaAnswersRepository } from './prisma/repositories/prisma-answers-repository'
import { PrismaAnswerCommentsRepository } from './prisma/repositories/prisma-answer-comments-repository'
import { QuestionsRespository } from '@/domain/forum/application/respositories/questions-repository'
import { StudentsRespository } from '@/domain/forum/application/respositories/students-repository'
import { PrismaStudentsRepository } from './prisma/repositories/prisma-students-repository'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/respositories/question-attachments-repository'
import { QuestionCommentsRepository } from '@/domain/forum/application/respositories/question-comments-repository'
import { AnswersRespository } from '@/domain/forum/application/respositories/answers-repository'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/respositories/answer-attachments-repository'
import { AnswerCommentsRepository } from '@/domain/forum/application/respositories/answer-comments-repository'
import { AttachmentRepository } from '@/domain/forum/application/respositories/attachments-repository'
import { PrismaAttachmentsRepository } from './prisma/repositories/prisma-attachments-repository'

@Module({
    providers: [
        PrismaService,
        {
            provide: QuestionsRespository,
            useClass: PrismaQuestionsRepository
        },
        {
            provide: StudentsRespository,
            useClass: PrismaStudentsRepository
        },
        { 
            provide: QuestionAttachmentsRepository,
            useClass: PrismaQuestionAttachmentsRepository,
        },
        { 
            provide: QuestionCommentsRepository,
            useClass: PrismaQuestionCommentsRepository,
        },
        { 
            provide: AnswersRespository,
            useClass: PrismaAnswersRepository,
        },
        { 
            provide: AnswerAttachmentsRepository,
            useClass: PrismaAnswerAttachmentsRepository,
        },
        { 
            provide: AnswerCommentsRepository,
            useClass: PrismaAnswerCommentsRepository,
        },
        {
            provide: AttachmentRepository,
            useClass: PrismaAttachmentsRepository
        }
    ],
    exports: [
        PrismaService,
        QuestionsRespository,
        StudentsRespository,
        QuestionAttachmentsRepository,
        QuestionCommentsRepository,
        AnswersRespository,
        AnswerAttachmentsRepository,
        AnswerCommentsRepository,
        AttachmentRepository
    ],
})

export class DatabaseModule {}