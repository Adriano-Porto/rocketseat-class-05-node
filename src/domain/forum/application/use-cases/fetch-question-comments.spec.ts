import { expect, describe, it } from 'vitest'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { makeQuestion } from 'test/factories/make-question'
import { FetchQuestionCommentsUseCase } from './fetch-question-comments'
import { makeQuestionComment } from 'test/factories/make-question-comment'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments-repository'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-questions-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionCommentRepository: InMemoryQuestionCommentRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository

let sut: FetchQuestionCommentsUseCase

describe('Fetch Questions Questions UseCase', () => {
    beforeEach(() => {
        inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository() 

        inMemoryQuestionAttachmentRepository = new InMemoryQuestionAttachmentRepository()
        inMemoryStudentsRepository = new InMemoryStudentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentRepository, inMemoryAttachmentsRepository, inMemoryStudentsRepository)
        inMemoryQuestionCommentRepository = new InMemoryQuestionCommentRepository(inMemoryStudentsRepository)
        sut = new FetchQuestionCommentsUseCase(inMemoryQuestionCommentRepository)
    })
    it('should be able to fetch recent questions', async () => {
        const newQuestion = await makeQuestion()
        const student = await makeStudent({name : 'John Doe'})

        await inMemoryStudentsRepository.items.push(student)

        await inMemoryQuestionsRepository.create(newQuestion)
        const comment1 = await makeQuestionComment({questionId: newQuestion.id, authorId: student.id})
        const comment2 = await makeQuestionComment({questionId: newQuestion.id, authorId: student.id})
        const comment3 = await makeQuestionComment({questionId: newQuestion.id, authorId: student.id})
        
        await inMemoryQuestionCommentRepository.create(
            comment1
        )

        await inMemoryQuestionCommentRepository.create(
            comment2
        )

        await inMemoryQuestionCommentRepository.create(
            comment3
        )

        const result = await sut.execute({
            questionId: newQuestion.id.toString(),
            page : 1
        })

        expect(result.isRight()).toBe(true)
        expect(result.value?.comments).toHaveLength(3)

        expect(result.value.comments).toEqual(expect.arrayContaining([
            expect.objectContaining({
                author: 'John Doe',
                commentId: comment1.id
            }),
            expect.objectContaining({
                author: 'John Doe',
                commentId: comment1.id
            }),
            expect.objectContaining({
                author: 'John Doe',
                commentId: comment1.id
            })
        ]))

    })

    it('should be able to get paginated question questions', async () => {
        const newQuestion = await makeQuestion()

        await inMemoryQuestionsRepository.create(newQuestion)

        const student = await makeStudent({name : 'John Doe'})

        await inMemoryStudentsRepository.items.push(student)


        for (let i = 1; i <= 25; i ++) {
            await inMemoryQuestionCommentRepository.create(
                await makeQuestionComment({questionId: newQuestion.id, authorId: student.id})
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

        expect(fetchPageOne.value?.comments).toHaveLength(20)
        expect(fetchPageTwo.value?.comments).toHaveLength(5)
    })
})