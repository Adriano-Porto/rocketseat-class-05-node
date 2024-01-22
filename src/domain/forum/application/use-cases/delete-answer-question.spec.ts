import { expect, describe, it } from 'vitest'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from 'test/factories/make-answer'
import { DeleteAnswerUseCase } from './delete-answer-question'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answers-attachment-repository'
import { makeAnswerAttachment } from 'test/factories/make-answer-attachment'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswersAttachmentRepository: InMemoryAnswerAttachmentRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer UseCase', () => {
    beforeEach(() => {
        inMemoryAnswersAttachmentRepository = new InMemoryAnswerAttachmentRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentRepository)
        sut = new DeleteAnswerUseCase(inMemoryAnswersRepository)
    })
    it('should be able to delete answer', async () => {
        const newAnswer = await makeAnswer({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('answer-1'))
        
        await inMemoryAnswersRepository.create(newAnswer)

        inMemoryAnswersAttachmentRepository.items.push(
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
            authorId: 'author-1'
        })

        expect(inMemoryAnswersRepository.items).toHaveLength(0)
        expect(inMemoryAnswersAttachmentRepository.items).toHaveLength(0)

    })
    it('should not be able to delete answer from a different author', async () => {
        const newAnswer = await makeAnswer({
            authorId: new UniqueEntityID('author-1')
        }, new UniqueEntityID('answer-1'))
        
        await inMemoryAnswersRepository.create(newAnswer)

        inMemoryAnswersAttachmentRepository.items.push(
            await makeAnswerAttachment({
                answerId: newAnswer.id,
                attachmentId: new UniqueEntityID('1')
            }),
        )

        const result = await sut.execute({
            answerId: 'answer-1',
            authorId: 'author-2'
        })

        expect(result.isLeft()).toBe(true)

        expect(inMemoryAnswersRepository.items).toHaveLength(1)
        expect(inMemoryAnswersAttachmentRepository.items).toHaveLength(1)

    })
    
})