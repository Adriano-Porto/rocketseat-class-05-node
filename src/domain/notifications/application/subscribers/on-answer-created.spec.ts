import { makeAnswer } from 'test/factories/make-answer'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answers-attachment-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-questions-attachments-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { makeQuestion } from 'test/factories/make-question'
import { SpyInstance } from 'vitest'
import { waitFor } from 'test/utils/wait-for'
import { OnQuestionBestAnswerChosen } from './on-question-best-answer-chosen'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository

let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository

let inMemoryAnswersAttachmentRepository: InMemoryAnswerAttachmentRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository

let inMemoryNotificationsRepository: InMemoryNotificationsRepository

let sendNotificationUseCase: SendNotificationUseCase
let sendNotificationExecuteSpy: SpyInstance

describe('On Question Best Answer Chosen', () => {
    beforeEach(()=> {
        inMemoryQuestionsAttachmentsRepository = new InMemoryQuestionAttachmentRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionsAttachmentsRepository, inMemoryAttachmentsRepository, inMemoryStudentsRepository)

        inMemoryStudentsRepository = new InMemoryStudentsRepository()
        inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository()

        inMemoryAnswersAttachmentRepository = new InMemoryAnswerAttachmentRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentRepository)
        
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

        sendNotificationUseCase = new SendNotificationUseCase(inMemoryNotificationsRepository)
        
        sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')
        new OnQuestionBestAnswerChosen(inMemoryAnswersRepository, sendNotificationUseCase)
    })

    it('should send a notification when an question has new best answer chosen', async () => {
        const question = await makeQuestion()
        const answer = await makeAnswer({questionId: question.id})

        await inMemoryQuestionsRepository.create(question)
        await inMemoryAnswersRepository.create(answer)

        question.bestAnswerId = answer.id

        await inMemoryQuestionsRepository.save(question)

        await waitFor(
            () => {
                expect(sendNotificationExecuteSpy).toHaveBeenCalled()
            }
        )
    })
})