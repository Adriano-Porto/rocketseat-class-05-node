import { expect, describe, it } from 'vitest'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswerCommentsRepository } from 'test/repositories/in-memory-answers-comment-repository'
import { FetchAnswerCommentsUseCase } from './fetch-answer-comments'
import { makeAnswerComment } from 'test/factories/make-answer-comment'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answers-attachment-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { makeStudent } from 'test/factories/make-student'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryAnswersCommentsRepository: InMemoryAnswerCommentsRepository
let inMemoryAnswersAttachmentsRepository: InMemoryAnswerAttachmentRepository
let inMemoryStudentsRepository: InMemoryStudentsRepository 

let sut: FetchAnswerCommentsUseCase

describe('Fetch Answers Answers UseCase', () => {
    beforeEach(() => {
        inMemoryAnswersAttachmentsRepository = new InMemoryAnswerAttachmentRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentsRepository)
        inMemoryStudentsRepository = new InMemoryStudentsRepository()
        inMemoryAnswersCommentsRepository = new InMemoryAnswerCommentsRepository(inMemoryStudentsRepository)
        sut = new FetchAnswerCommentsUseCase(inMemoryAnswersCommentsRepository)
    })
    it('should be able to fetch recent answers', async () => {
        const newAnswer = await makeAnswer()
        
        const student = await makeStudent({name : 'John Doe'})

        await inMemoryStudentsRepository.items.push(student)

        const answerComment1 =  await makeAnswerComment({
            answerId: newAnswer.id,
            authorId: student.id
        })
        const answerComment2 =  await makeAnswerComment({
            answerId: newAnswer.id,
            authorId: student.id
        })
        const answerComment3 =  await makeAnswerComment({
            answerId: newAnswer.id,
            authorId: student.id
        })

        await inMemoryAnswersRepository.create(newAnswer)
        await inMemoryAnswersCommentsRepository.create(answerComment1)
        await inMemoryAnswersCommentsRepository.create(answerComment2)
        await inMemoryAnswersCommentsRepository.create(answerComment3)

        const result = await sut.execute({
            answerId: newAnswer.id.toString(),
            page : 1
        })

        expect(result.isRight()).toBe(true)
        expect(result.value?.comments).toHaveLength(3)
    })

    it('should be able to get paginated question answers', async () => {
        const newAnswer = await makeAnswer()

        const student = await makeStudent({name : 'John Doe'})

        await inMemoryStudentsRepository.items.push(student)

        await inMemoryAnswersRepository.create(newAnswer)

        for (let i = 1; i <= 25; i ++) {
            await inMemoryAnswersCommentsRepository.create(
                await makeAnswerComment({
                    answerId: newAnswer.id,
                    authorId: student.id
                })
            )
        }

        const fetchPageOne = await sut.execute({
            answerId: newAnswer.id.toString(),
            
            page : 1
        })
        const fetchPageTwo = await sut.execute({
            answerId: newAnswer.id.toString(),
            page: 2
        })

        expect(fetchPageOne.isRight()).toBe(true)
        expect(fetchPageTwo.isRight()).toBe(true)

        expect(fetchPageTwo.value?.comments).toHaveLength(5)
        expect(fetchPageOne.value?.comments).toHaveLength(20)
    })
})