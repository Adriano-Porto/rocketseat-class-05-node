import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question, QuestionProps } from '@/domain/forum/enterprise/entities/question'

export async function makeQuestion(override: Partial<QuestionProps> = {}, id?: UniqueEntityID) {
    const question = await Question.create({
        authorId: new UniqueEntityID(),
        content: faker.lorem.text(),
        title: faker.lorem.sentence(),
        ...override
    }, id)

    return question
}