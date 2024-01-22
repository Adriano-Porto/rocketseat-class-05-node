import { makeAnswer } from 'test/factories/make-answer'
import { OnAnswerCreated } from './on-answer-created'
import { InMemoryAnswersRepository } from 'test/repositories/in-memory-answers-repository'
import { InMemoryAnswerAttachmentRepository } from 'test/repositories/in-memory-answers-attachment-repository'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-questions-attachments-repository'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { makeQuestion } from 'test/factories/make-question'
import { SpyInstance } from 'vitest'
import { waitFor } from 'test/utils/wait-for'

let inMemoryQuestionsAttachmentsRepository: InMemoryQuestionAttachmentRepository
let inMemoryQuestionsRepository: InMemoryQuestionsRepository

let inMemoryAnswersAttachmentRepository: InMemoryAnswerAttachmentRepository
let inMemoryAnswersRepository: InMemoryAnswersRepository

let inMemoryNotificationsRepository: InMemoryNotificationsRepository

let sendNotificationUseCase: SendNotificationUseCase
let sendNotificationExecuteSpy: SpyInstance

describe('On Answer Created', () => {
    beforeEach(()=> {
        inMemoryQuestionsAttachmentsRepository = new InMemoryQuestionAttachmentRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionsAttachmentsRepository)

        inMemoryAnswersAttachmentRepository = new InMemoryAnswerAttachmentRepository()
        inMemoryAnswersRepository = new InMemoryAnswersRepository(inMemoryAnswersAttachmentRepository)
        
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

        sendNotificationUseCase = new SendNotificationUseCase(inMemoryNotificationsRepository)
        
        sendNotificationExecuteSpy = vi.spyOn(sendNotificationUseCase, 'execute')
        new OnAnswerCreated(inMemoryQuestionsRepository, sendNotificationUseCase)
    })

    it('should send a notification when an answer is created', async () => {
        const question = await makeQuestion()
        const answer = await makeAnswer({questionId: question.id})

        await inMemoryQuestionsRepository.create(question)
        await inMemoryAnswersRepository.create(answer)

        await waitFor(
            () => {
                expect(sendNotificationExecuteSpy).toHaveBeenCalled()
            }
        )
    })
})