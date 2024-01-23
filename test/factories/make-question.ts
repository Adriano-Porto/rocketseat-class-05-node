import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question, QuestionProps } from '@/domain/forum/enterprise/entities/question'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaQuestionMapper } from '@/infra/database/prisma/mappers/prisma-question-mapper'

export async function makeQuestion(override: Partial<QuestionProps> = {}, id?: UniqueEntityID) {
    const question = await Question.create({
        authorId: new UniqueEntityID(),
        content: faker.lorem.text(),
        title: faker.lorem.sentence(),
        ...override
    }, id)

    return question
}

@Injectable()
export class QuestionFactory {
    constructor(private prisma: PrismaService) {}

    async makePrismaQuestion (data: Partial<QuestionProps> = {}): Promise<Question> {
        const question = await makeQuestion(data)
        await this.prisma.question.create({
            data: PrismaQuestionMapper.toPrisma(question)
        })

        return question
    }
} 