import { expect, describe, it } from 'vitest'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { EditQuestionUseCase } from './edit-question'
import { makeQuestion } from 'test/factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-questions-attachments-repository'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionsAttachmentRepository: InMemoryQuestionAttachmentRepository

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository


let sut: EditQuestionUseCase

describe('Edit Question UseCase', () => {
    beforeEach(() => {
        inMemoryQuestionsAttachmentRepository = new InMemoryQuestionAttachmentRepository()
        inMemoryStudentsRepository = new InMemoryStudentsRepository()
        inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository() 
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionsAttachmentRepository, inMemoryAttachmentsRepository, inMemoryStudentsRepository)        
        sut = new EditQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestionsAttachmentRepository)
    })
    it('should be able to edit question', async () => {
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
            authorId: 'author-1',
            title: 'hello',
            content: 'world',
            attachmentsIds: ['1', '3']
        })

        expect(inMemoryQuestionsRepository.items[0]).toMatchObject({
            title: 'hello',
            content: 'world'
        })

        expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toHaveLength(2)
        expect(inMemoryQuestionsRepository.items[0].attachments.currentItems).toEqual([
            expect.objectContaining({attachmentId: new UniqueEntityID('1')}),
            expect.objectContaining({attachmentId: new UniqueEntityID('3')})

        ])
    })
    it('should not be able to edit question from a different author', async () => {
        const newQuestion = await makeQuestion({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('question-1'))
        
        await inMemoryQuestionsRepository.create(newQuestion)

        const result = await sut.execute({
            questionId: 'question-1',
            authorId: 'author-2',
            title: 'hello',
            content: 'world',
            attachmentsIds: ['1', '2']
        })

        expect(result.isLeft()).toBe(true)
        expect(inMemoryQuestionsRepository.items).toHaveLength(1)
    })

    it('it should edit new and removed attachments when editing a question', async () => {
        const newQuestion = await makeQuestion(
            {authorId: new UniqueEntityID('author-1')}
            , new UniqueEntityID('question-id'))

        await inMemoryQuestionsRepository.create(newQuestion)
        
        inMemoryQuestionsAttachmentRepository.items.push(
            await makeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityID('1')
            })
        )

        inMemoryQuestionsAttachmentRepository.items.push(
            await makeQuestionAttachment({
                questionId: newQuestion.id,
                attachmentId: new UniqueEntityID('2')
            })
        )

        const result = await sut.execute({
            questionId: newQuestion.id.toValue(),
            authorId: 'author-1',
            title: 'Pergunta Teste',
            content: 'Conteudo teste',
            attachmentsIds: ['1', '3']
        })

        
        expect(result.isRight()).toBe(true)
        expect(inMemoryQuestionsAttachmentRepository.items).toHaveLength(2)
        expect(inMemoryQuestionsAttachmentRepository.items).toEqual(
            expect.arrayContaining([
                expect.objectContaining({attachmentId: new UniqueEntityID('1')}),
                expect.objectContaining({attachmentId: new UniqueEntityID('3')}),

            ])
        )
    })
    
})

