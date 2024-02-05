import { expect, describe, it } from 'vitest'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from './edit-answer'
import { makeAnswer } from 'test/factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answers-attachment-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswersAttachmentsRepository: InMemoryAnswerAttachmentRepository
let sut: EditAnswerUseCase

describe('Edit Answer UseCase', () => {
    beforeEach(() => {
        inMemoryAnswersAttachmentsRepository = new InMemoryAnswerAttachmentRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentsRepository)
        sut = new EditAnswerUseCase(inMemoryAnswersRepository, inMemoryAnswersAttachmentsRepository)
    })
    it('should be able to edit answer', async () => {
        const newAnswer = await makeAnswer({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('answer-1'))
        
        await inMemoryAnswersRepository.create(newAnswer)

        inMemoryAnswersAttachmentsRepository.items.push(
            await makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityID('1')
            }),
            await makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityID('2')
            })
        )

        await sut.execute({
            answerId: 'answer-1',
            authorId: 'author-1',
            content: 'world',
            attachmentsIds: ['1', '3']
        })

        expect(inMemoryAnswersRepository.items[0]).toMatchObject({
            content: 'world'
        })

        expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toHaveLength(2)
        expect(inMemoryAnswersRepository.items[0].attachments.currentItems).toEqual([
            expect.objectContaining({attachmentId: new UniqueEntityID('1')}),
            expect.objectContaining({attachmentId: new UniqueEntityID('3')})

        ])
    })
    it('should not be able to edit answer from a different author', async () => {
        const newAnswer = await makeAnswer({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('answer-1'))
        
        await inMemoryAnswersRepository.create(newAnswer)

        const result = await sut.execute({
            answerId: 'answer-1',
            authorId: 'author-2',
            content: 'world',
            attachmentsIds: ['1', '2']
        })

        expect(result.isLeft()).toBe(true)
        expect(inMemoryAnswersRepository.items).toHaveLength(1)
    })

    it('it should edit new and removed attachments when editing a answer', async () => {
        const newAnswer = await makeAnswer(
            {
                authorId: new UniqueEntityID('author-1')
            }
            , new UniqueEntityID('answer-id'))

        await inMemoryAnswersRepository.create(newAnswer)
        
        inMemoryAnswersAttachmentsRepository.items.push(
            await makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityID('1')
            })
        )

        inMemoryAnswersAttachmentsRepository.items.push(
            await makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityID('2')
            })
        )

        const result = await sut.execute({
            answerId: newAnswer.id.toString(),
            authorId: 'author-1',
            content: 'Conteudo teste',
            attachmentsIds: ['1', '3']
        })

        
        expect(result.isRight()).toBe(true)
        expect(inMemoryAnswersAttachmentsRepository.items).toHaveLength(2)
        expect(inMemoryAnswersAttachmentsRepository.items).toEqual(
            expect.arrayContaining([
                expect.objectContaining({attachmentId: new UniqueEntityID('1')}),
                expect.objectContaining({attachmentId: new UniqueEntityID('3')}),

            ])
        )
    })
    
})