import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Notification, NotificationProps } from '@/domain/notifications/enterprise/entities/notification'

export async function makeNotification(override: Partial<NotificationProps> = {}, id?: UniqueEntityID) {
    const notification = await Notification.create({
        recipientId: new UniqueEntityID(),
        content: faker.lorem.sentence(4),
        title: faker.lorem.sentence(12),
        ...override
    }, id)

    return notification
}