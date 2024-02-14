import { Either, right } from '@/core/either'
import { Notification } from '../../enterprise/entities/notification'
import { NotificationsRepository } from '../repositories/notifications-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Injectable } from '@nestjs/common'


export interface SendNotificationUseCaseInput {
    recipientId: string,
    title: string,
    content: string,
}

export type SendNotificationUseCaseOutput = Either<null, { 
    notification: Notification
 }>

@Injectable()
export class SendNotificationUseCase {
    constructor(private notificationsRepository: NotificationsRepository) {}

    async execute({
        recipientId,
        title,
        content,
    }: SendNotificationUseCaseInput): Promise<SendNotificationUseCaseOutput> {
        
        const notification = Notification.create({
            recipientId: new UniqueEntityID(recipientId),
            title,
            content
        })

        await this.notificationsRepository.create(notification)

        return right({
            notification
        })
    }
}