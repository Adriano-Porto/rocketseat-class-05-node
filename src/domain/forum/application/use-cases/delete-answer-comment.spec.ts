import { expect, describe, it } from 'vitest'
import { DeleteAnswerCommentUseCase } from './delete-answer-comment'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answers-comment-repository'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryAnswerCommentsRepository: InMemoryAnswerCommentsRepository
let sut: DeleteAnswerCommentUseCase

let inMemoryStudentsRepository: InMemoryStudentsRepository


describe('Delete Answer Comment', () => {
    beforeEach(() => {
        inMemoryStudentsRepository = new InMemoryStudentsRepository()
        inMemoryAnswerCommentsRepository = new InMemoryAnswerCommentsRepository(inMemoryStudentsRepository)
        sut = new DeleteAnswerCommentUseCase(inMemoryAnswerCommentsRepository)
    })
    it('should be able to delete answer comment', async () => {
        const answerComment = await makeAnswerComment()

        await inMemoryAnswerCommentsRepository.create(answerComment)

        await sut.execute({
            answerCommentId: answerComment.id.toString(),
            authorId: answerComment.authorId.toString(),
        })

        expect(inMemoryAnswerCommentsRepository.items).toHaveLength(0)
    })

    it('should not be able to delete another author answer comment', async () => {
        const answerComment = await makeAnswerComment()

        await inMemoryAnswerCommentsRepository.create(answerComment)

        const result = await sut.execute({
            answerCommentId: answerComment.id.toString(),
            authorId: 'author-2',
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
    })
})