import { expect, describe, it } from 'vitest'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answers-comment-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answers-attachment-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswersCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryAnswersAttachmentsRepository: InMemoryAnswerAttachmentRepository

let sut: FetchAnswerCommentsUseCase

describe('Fetch Answers Answers UseCase', () => {
    beforeEach(() => {
        inMemoryAnswersAttachmentsRepository = new InMemoryAnswerAttachmentRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentsRepository)
        inMemoryAnswersCommentsRepository = new InMemoryAnswerCommentsRepository()
        sut = new FetchAnswerCommentsUseCase(inMemoryAnswersCommentsRepository)
    })
    it('should be able to fetch recent answers', async () => {
        const newAnswer = await makeAnswer()

        await inMemoryAnswersRepository.create(newAnswer)

        await inMemoryAnswersCommentsRepository.create(
            await makeAnswerComment({answerId: newAnswer.id})
        )

        await inMemoryAnswersCommentsRepository.create(
            await makeAnswerComment({answerId: newAnswer.id})
        )

        await inMemoryAnswersCommentsRepository.create(
            await makeAnswerComment({answerId: newAnswer.id})
        )

        const result = await sut.execute({
            answerId: newAnswer.id.toString(),
            page : 1
        })

        expect(result.isRight()).toBe(true)
        expect(result.value?.answerComments).toHaveLength(3)
    })

    it('should be able to get paginated question answers', async () => {
        const newAnswer = await makeAnswer()

        await inMemoryAnswersRepository.create(newAnswer)

        for (let i = 1; i <= 25; i ++) {
            await inMemoryAnswersCommentsRepository.create(
                await makeAnswerComment({answerId: newAnswer.id})
            )
        }

        const fetchPageOne = await sut.execute({
            answerId: newAnswer.id.toString(),
            page : 1
        })
        const fetchPageTwo = await sut.execute({
            answerId: newAnswer.id.toString(),
            page: 2
        })

        expect(fetchPageOne.isRight()).toBe(true)
        expect(fetchPageTwo.isRight()).toBe(true)

        expect(fetchPageTwo.value?.answerComments).toHaveLength(5)
        expect(fetchPageOne.value?.answerComments).toHaveLength(20)
    })
})