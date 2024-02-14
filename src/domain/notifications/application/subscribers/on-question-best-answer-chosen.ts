import { DomainEvents } from '@/core/events/domain-events'
import { EventHandler } from '@/core/events/event-handler'
import { SendNotificationUseCase } from '../use-cases/send-notification'
import { AnswersRespository } from '@/domain/forum/application/respositories/answers-repository'
import { QuestionBestAnswerChoosenEvent } from '@/domain/forum/events/question-best-answer-chosen'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OnQuestionBestAnswerChosen implements EventHandler {
    constructor(
        private answersRepository: AnswersRespository,
        private sendNotification: SendNotificationUseCase
    ) {
        this.setupSubscriptions()        
    }
    setupSubscriptions(): void {
        DomainEvents.register(
            this.sendNewAnswerNotification.bind(this),
            QuestionBestAnswerChoosenEvent.name
        )
    }

    private async sendNewAnswerNotification({
        question,
        bestAnswerId
    }: QuestionBestAnswerChoosenEvent) {
        
        const answer = await this.answersRepository.findById(
            bestAnswerId.toString()
        )

        if (answer) {
    
            await this.sendNotification.execute({
                recipientId: answer.authorId.toString(),
                title: 'Sua resposta foi escolhida!',
                content: `A resposta que você envirou em "${question.title.substring(20).concat('...')}" foi escolhida pelo autor!`
            })
        }
            
            
    }
}