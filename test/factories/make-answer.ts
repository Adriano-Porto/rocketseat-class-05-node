import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer, AnswerProps } from '@/domain/forum/enterprise/entities/answer'

export async function makeAnswer(override: Partial<AnswerProps> = {}, id?: UniqueEntityID) {
    const answer = await Answer.create({
        authorId: new UniqueEntityID(),
        content: faker.lorem.text(),
        questionId: new UniqueEntityID(),
        ...override
    }, id)

    return answer
}