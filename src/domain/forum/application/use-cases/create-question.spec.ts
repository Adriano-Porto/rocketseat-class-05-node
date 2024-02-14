import { expect, describe, it } from 'vitest'
import { CreateQuestionUseCase } from './create-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-questions-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let sut: CreateQuestionUseCase

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository

describe('Create Question', () => {
    beforeEach(() => {
        inMemoryStudentsRepository = new InMemoryStudentsRepository()
        inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository() 
        
        inMemoryQuestionAttachmentRepository = new InMemoryQuestionAttachmentRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentRepository, inMemoryAttachmentsRepository, inMemoryStudentsRepository)

        sut = new CreateQuestionUseCase(inMemoryQuestionsRepository)
    })
    it('should be able to create question', async () => {
        const result = await sut.execute({
            authorId: '1',
            content: 'lorem ipsum',
            title: 'lorem',
            attachmentsIds: ['1', '2']
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryQuestionsRepository.items[0]).toEqual(result.value?.question)
        expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toHaveLength(2)
        expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toEqual([
            expect.objectContaining({attachmentId: new UniqueEntityID('1')}),
            expect.objectContaining({attachmentId: new UniqueEntityID('2')})

        ])
    })
    it('should persist attachments when creating a new question', async () => {
        const result = await sut.execute({
            authorId: '1',
            content: 'lorem ipsum',
            title: 'lorem',
            attachmentsIds: ['1', '2']
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryQuestionAttachmentRepository.items).toHaveLength(2)
        expect(inMemoryQuestionAttachmentRepository.items).toEqual(
            expect.arrayContaining([
                expect.objectContaining({attachmentId: new UniqueEntityID('1')}),
                expect.objectContaining({attachmentId: new UniqueEntityID('2')}),

            ])
        )
    })
})