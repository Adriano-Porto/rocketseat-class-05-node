import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRespository } from '@/domain/forum/application/respositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerMapper } from '../mappers/prisma-answer-mapper'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/respositories/answer-attachments-repository'

@Injectable()
export class PrismaAnswersRepository implements AnswersRespository {
    constructor(
        private prisma: PrismaService,
        private answerAttachmentsRepository: AnswerAttachmentsRepository
    ) {}

    async create(answer: Answer): Promise<void> {
        const data = PrismaAnswerMapper.toPrisma(answer)

        await this.prisma.answer.create({
            data
        })

        await this.answerAttachmentsRepository.createMany(
            answer.attachments.getItems()
        )

    }
    async save(answer: Answer): Promise<void> {
        const data = PrismaAnswerMapper.toPrisma(answer)

        await this.prisma.answer.update({
            where: {
                id: data.id
            },
            data
        })

        await Promise.all([
            this.prisma.answer.update({
                where: {
                    id: data.id
                },
                data
            }),
            this.answerAttachmentsRepository.createMany(
                answer.attachments.getNewItems()
            ),
            this.answerAttachmentsRepository.deleteMany(
                answer.attachments.getRemovedItems()
            )
        ])
    }
    async delete(answer: Answer): Promise<void> {
        const data = PrismaAnswerMapper.toPrisma(answer)

        await this.prisma.answer.delete({
            where: {
                id: data.id
            }
        })
    }
    async findById(id: string): Promise<Answer> {
        const answer = await this.prisma.answer.findUnique({
            where: {
                id
            }
        })

        if (!answer) return null

        return PrismaAnswerMapper.toDomain(answer)
    }
    async findManyByQuestionId(questionId: string, { page }: PaginationParams): Promise<Answer[]> {
        const answers = await this.prisma.answer.findMany({
            where: {
                questionId,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 20,
            skip: (page -1) * 20,
        })


        return answers.map(PrismaAnswerMapper.toDomain)
    }
}