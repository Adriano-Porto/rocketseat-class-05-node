import { expect, describe, it } from 'vitest'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { FetchQuestionAnswersUseCase } from './fetch-questions-answers'
import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-questions-attachments-repository'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answers-attachment-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'

let inMemoryAnswersRepository: InMemoryAnswersRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryAnswersAttachmentsRepository: InMemoryAnswerAttachmentRepository

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository
let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository

let sut: FetchQuestionAnswersUseCase
describe('Fetch Answers Answers UseCase', () => {
    beforeEach(() => {
        inMemoryQuestionAttachmentRepository = new InMemoryQuestionAttachmentRepository()
        inMemoryStudentsRepository = new InMemoryStudentsRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentRepository, inMemoryAttachmentsRepository, inMemoryStudentsRepository)

        inMemoryAnswersAttachmentsRepository = new InMemoryAnswerAttachmentRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentsRepository)

        sut = new FetchQuestionAnswersUseCase(inMemoryAnswersRepository)
    })
    it('should be able to fetch recent answers', async () => {
        const newQuestion = await makeQuestion()

        await inMemoryQuestionsRepository.create(newQuestion)

        await inMemoryAnswersRepository.create(
            await makeAnswer({questionId: newQuestion.id})
        )

        await inMemoryAnswersRepository.create(
            await makeAnswer({questionId: newQuestion.id})
        )

        await inMemoryAnswersRepository.create(
            await makeAnswer({questionId: newQuestion.id})
        )

        const result = await sut.execute({
            questionId: newQuestion.id.toString(),
            page : 1
        })


        expect(result.isRight()).toBe(true)
        expect(result.value?.answers).toHaveLength(3)
        
        
    })

    it('should be able to get paginated question answers', async () => {
        const newQuestion = await makeQuestion()

        await inMemoryQuestionsRepository.create(newQuestion)

        for (let i = 1; i <= 25; i ++) {
            await inMemoryAnswersRepository.create(
                await makeAnswer({questionId: newQuestion.id})
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

        expect(fetchPageOne.value?.answers).toHaveLength(20)
        expect(fetchPageTwo.value?.answers).toHaveLength(5)
    })
})