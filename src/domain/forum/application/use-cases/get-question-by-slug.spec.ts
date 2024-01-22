import { expect, describe, it } from 'vitest'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-questions-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository

describe('Get Question By Slug', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentRepository = new InMemoryQuestionAttachmentRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentRepository)

        sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
    })
    it('should be able to get a question by slug', async () => {
        const newQuestion = await makeQuestion({
            title: 'example question',
            slug: Slug.create('example-question'),
        })

        inMemoryQuestionsRepository.create(newQuestion)

        const result = await sut.execute({
            slug: 'example-question'
        })


        expect(result.isRight()).toBe(true)
        
        if (!result.isRight()) return
        expect(result.value.question).toEqual(newQuestion)
    })
})