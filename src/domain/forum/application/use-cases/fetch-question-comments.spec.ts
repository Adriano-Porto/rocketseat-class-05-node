import { expect, describe, it } from 'vitest'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-questions-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let sut: FetchQuestionCommentsUseCase

describe('Fetch Questions Questions UseCase', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentRepository = new InMemoryQuestionAttachmentRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentRepository)
        inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository()
        sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentRepository)
    })
    it('should be able to fetch recent questions', async () => {
        const newQuestion = await makeQuestion()

        await inMemoryQuestionsRepository.create(newQuestion)

        await inMemoryQuestionCommentRepository.create(
            await makeQuestionComment({questionId: newQuestion.id})
        )

        await inMemoryQuestionCommentRepository.create(
            await makeQuestionComment({questionId: newQuestion.id})
        )

        await inMemoryQuestionCommentRepository.create(
            await makeQuestionComment({questionId: newQuestion.id})
        )

        const result = await sut.execute({
            questionId: newQuestion.id.toString(),
            page : 1
        })

        expect(result.isRight()).toBe(true)
        expect(result.value?.questionComments).toHaveLength(3)
    })

    it('should be able to get paginated question questions', async () => {
        const newQuestion = await makeQuestion()

        await inMemoryQuestionsRepository.create(newQuestion)

        for (let i = 1; i <= 25; i ++) {
            await inMemoryQuestionCommentRepository.create(
                await makeQuestionComment({questionId: newQuestion.id})
            )
        }

        const fetchPageOne = await sut.execute({
            questionId: newQuestion.id.toString(),
            page : 1
        })
        const fetchPageTwo = await sut.execute({
            questionId: newQuestion.id.toString(),
            page: 2
        })

        expect(fetchPageOne.isRight()).toBe(true)
        expect(fetchPageTwo.isRight()).toBe(true)

        expect(fetchPageOne.value?.questionComments).toHaveLength(20)
        expect(fetchPageTwo.value?.questionComments).toHaveLength(5)
    })
})