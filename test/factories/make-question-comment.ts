import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { QuestionComment, QuestionCommentProps } from '@/domain/forum/enterprise/entities/question-comment'

export async function makeQuestionComment(override: Partial<QuestionCommentProps> = {}, id?: UniqueEntityID) {
    const questioncomment = await QuestionComment.create({
        authorId: new UniqueEntityID(),
        questionId: new UniqueEntityID(),
        content: faker.lorem.text(),
        ...override
    }, id)

    return questioncomment
}