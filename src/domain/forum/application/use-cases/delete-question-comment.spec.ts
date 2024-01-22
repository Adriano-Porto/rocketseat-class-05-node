import { expect, describe, it } from 'vitest'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments-repository'
import { DeleteQuestionCommentUseCase } from './delete-question-comment'
import { makeQuestionComment } from 'test/factories/make-question-comment'

let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentRepository
let sut: DeleteQuestionCommentUseCase

describe('Delete Question Comment', () => {
    beforeEach(() => {
        inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentRepository()
        sut = new DeleteQuestionCommentUseCase(inMemoryQuestionCommentsRepository)
    })
    it('should be able to delete question comment', async () => {
        const questionComment = await makeQuestionComment()

        await inMemoryQuestionCommentsRepository.create(questionComment)

        await sut.execute({
            questionCommentId: questionComment.id.toString(),
            authorId: questionComment.authorId.toString(),
        })

        expect(inMemoryQuestionCommentsRepository.items).toHaveLength(0)
    })

    it('should not be able to delete another author question comment', async () => {
        const questionComment = await makeQuestionComment()

        await inMemoryQuestionCommentsRepository.create(questionComment)

        const result = await sut.execute({
            questionCommentId: questionComment.id.toString(),
            authorId: 'author-2',
        })

        expect(result.isLeft()).toBe(true)
    })
})