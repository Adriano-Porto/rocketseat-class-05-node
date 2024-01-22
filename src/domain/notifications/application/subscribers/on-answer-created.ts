import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { QuestionsRespository } from '@/domain/forum/application/respositories/questions-repository'
import { AnswerCreatedAEvent } from '@/domain/forum/events/answer-created-events'
import { SendNotificationUseCase } from '../use-cases/send-notification'

export class OnAnswerCreated implements EventHandler {
    constructor(
        private questionsRepository: QuestionsRespository,
        private sendNotification: SendNotificationUseCase
    ) {
        this.setupSubscriptions()        
    }
    setupSubscriptions(): void {
        DomainEvents.register(
            this.sendNewAnswerNotification.bind(this),
            AnswerCreatedAEvent.name
        )
    }

    private async sendNewAnswerNotification({
        answer
    }: AnswerCreatedAEvent) {
        const question = await this.questionsRepository.findById(answer.questionId.toString())
        
        if (question) {
    
            await this.sendNotification.execute({
                recipientId: question.authorId.toString(),
                title: `Nova resposta em "${question.title.substring(0, 40).concat('...')}"`,
                content: answer.excerpt
            })
        }
            
            
    }
}