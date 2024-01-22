import { expect, describe, it } from 'vitest'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { FetchRecentQuestionsUseCase } from './fetch-recent-questions'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-questions-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository

let sut: FetchRecentQuestionsUseCase

describe('Fetch Recent Questions UseCase', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentRepository = new InMemoryQuestionAttachmentRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentRepository)
        sut = new FetchRecentQuestionsUseCase(inMemoryQuestionsRepository)
    })
    it('should be able to fetch recent questions', async () => {

        await inMemoryQuestionsRepository.create(
            await makeQuestion({createdAt: new Date(2022, 0, 20)})
        )
        await inMemoryQuestionsRepository.create(
            await makeQuestion({createdAt: new Date(2022, 0, 21)})
        )
        await inMemoryQuestionsRepository.create(
            await makeQuestion({createdAt: new Date(2022, 0, 22)})
        )

        const result = await sut.execute({page : 1})

        expect(result.isRight()).toBe(true)
        expect(result.value?.questions).toHaveLength(3)
        expect(result.value?.questions[0]).toEqual(expect.objectContaining({
            createdAt: new Date(2022, 0, 22)
        }))
        
    })

    it('should be able to get paginated recent question', async () => {

        for (let i = 1; i <= 25; i ++) {
            await inMemoryQuestionsRepository.create(
                await makeQuestion({createdAt: new Date(2022, 0, i)})
            )
        }

        const fetchPageOne = await sut.execute({page : 1})
        const fetchPageTwo = await sut.execute({page: 2})

        expect(fetchPageOne.isRight()).toBe(true)
        expect(fetchPageTwo.isRight()).toBe(true)

        expect(fetchPageOne.value?.questions).toHaveLength(20)
        expect(fetchPageTwo.value?.questions).toHaveLength(5)

        expect(fetchPageOne.value?.questions[0]).toEqual(expect.objectContaining({
            createdAt: new Date(2022, 0, 25)
        }))
        expect(fetchPageTwo.value?.questions[4]).toEqual(expect.objectContaining({
            createdAt: new Date(2022, 0, 1)
        }))
        
    })
})