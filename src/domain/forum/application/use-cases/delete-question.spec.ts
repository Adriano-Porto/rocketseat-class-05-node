import { expect, describe, it } from 'vitest'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { DeleteQuestionUseCase } from './delete-question'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-questions-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionsAttachmentRepository: InMemoryQuestionAttachmentRepository
let sut: DeleteQuestionUseCase
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository

describe('Delete Question UseCase', () => {
    beforeEach(() => {
        inMemoryQuestionsAttachmentRepository = new InMemoryQuestionAttachmentRepository()
        inMemoryStudentsRepository = new InMemoryStudentsRepository()
        inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository() 

        inMemoryQuestionsAttachmentRepository = new InMemoryQuestionAttachmentRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionsAttachmentRepository, inMemoryAttachmentsRepository, inMemoryStudentsRepository)
        sut = new DeleteQuestionUseCase(inMemoryQuestionsRepository)
    })
    it('should be able to delete question', async () => {
        const newQuestion = await makeQuestion({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('question-1'))
        
        await inMemoryQuestionsRepository.create(newQuestion)

        inMemoryQuestionsAttachmentRepository.items.push(
            await makeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityID('1')
            }),
            await makeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityID('2')
            })
        )


        await sut.execute({
            questionId: 'question-1',
            authorId: 'author-1'
        })

        expect(inMemoryQuestionsRepository.items).toHaveLength(0)
        expect(inMemoryQuestionsAttachmentRepository.items).toHaveLength(0)
    })
    it('should not be able to delete question from a different author', async () => {
        const newQuestion = await makeQuestion({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('question-1'))
        
        await inMemoryQuestionsRepository.create(newQuestion)

        const result = await sut.execute({
            questionId: 'question-1',
            authorId: 'author-2'
        })

        expect(result.isLeft()).toBe(true)
        expect(inMemoryQuestionsRepository.items).toHaveLength(1)
    })
    
})