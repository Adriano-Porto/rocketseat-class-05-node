import { expect, describe, it } from 'vitest'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from './get-question-by-slug'
import { makeQuestion } from 'test/factories/make-question'
import { Slug } from '../../enterprise/entities/value-objects/slug'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-questions-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { makeStudent } from 'test/factories/make-student'
import { makeAttachment } from 'test/factories/make-attachment'
import { makeQuestionAttachment } from 'test/factories/make-question-attachment'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository

let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentRepository = new InMemoryQuestionAttachmentRepository()
        inMemoryStudentsRepository = new InMemoryStudentsRepository()
        inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository() 
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentRepository, inMemoryAttachmentsRepository, inMemoryStudentsRepository)

        sut = new GetQuestionBySlugUseCase(inMemoryQuestionsRepository)
    })
    it('should be able to get a question by slug', async () => {
        const student = await makeStudent({name: 'John Doe'})

        inMemoryStudentsRepository.items.push(student)

        const attachment = await  makeAttachment({
            title: 'test attachment'
        })

        inMemoryAttachmentsRepository.items.push(attachment)


        const newQuestion = await makeQuestion({
            authorId: student.id,
            title: 'example question',
            slug: Slug.create('example-question'),
        })

        inMemoryQuestionsRepository.create(newQuestion)

        inMemoryQuestionAttachmentRepository.items.push(
            await makeQuestionAttachment({
                attachmentId: attachment.id,
                questionId: newQuestion.id
            })
        )

        const result = await sut.execute({
            slug: 'example-question'
        })


        expect(result.isRight()).toBe(true)
        
        if (!result.isRight()) return
        
        expect(result.value).toMatchObject({
            question: {
                title: newQuestion.title,
                author: 'John Doe',
                attachments: [
                    expect.objectContaining({
                        title: 'test attachment'
                    }),
                ]
            }
        })
    })
})