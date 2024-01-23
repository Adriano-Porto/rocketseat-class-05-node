import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '@/domain/forum/enterprise/entities/Answer'
import { Prisma, Answer as PrismaAnswer } from '@prisma/client'

export class PrismaAnswerMapper {
    static toDomain(raw: PrismaAnswer): Answer{
        return Answer.create({
            content: raw.content,
            authorId: new UniqueEntityID(raw.authorId),
            questionId: new UniqueEntityID(raw.questionId),
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt,
        }, new UniqueEntityID(raw.id))
    }

    static toPrisma(Answer: Answer): Prisma.AnswerUncheckedCreateInput {
        return {
            id: Answer.id.toString(),
            questionId: Answer.questionId.toString(),
            authorId: Answer.authorId.toString(),
            content: Answer.content,
            createdAt: Answer.createdAt,
            updatedAt: Answer.updatedAt
        }
    }
}