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
        PrismaQuestionAttachmentsRepository,
        PrismaQuestionCommentsRepository,
        PrismaAnswersRepository,
        PrismaAnswerAttachmentsRepository,
        PrismaAnswerCommentsRepository,
    ],
    exports: [
        PrismaService,
        QuestionsRespository,
        StudentsRespository,
        PrismaQuestionAttachmentsRepository,
        PrismaQuestionCommentsRepository,
        PrismaAnswersRepository,
        PrismaAnswerAttachmentsRepository,
        PrismaAnswerCommentsRepository,
    ],
})

export class DatabaseModule {}