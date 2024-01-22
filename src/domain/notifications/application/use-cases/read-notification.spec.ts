import { expect, describe, it } from 'vitest'
import { InMemoryNotificationsRepository } from 'test/repositories/in-memory-notifications-repository'
import { ReadNotificationUseCase } from './read-notification'
import { makeNotification } from 'test/factories/make-notification'
import { NotAllowedError } from '@/core/errors/errors/not-allowed-error'

let inMemoryNotificationsRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification', () => {
    beforeEach(() => {
        inMemoryNotificationsRepository = new InMemoryNotificationsRepository()

        sut = new ReadNotificationUseCase(inMemoryNotificationsRepository)
    })
    it('should be able to read Notification', async () => {
        
        const notification = await makeNotification()

        await inMemoryNotificationsRepository.create(notification)

        const result = await sut.execute({
            recipientId: notification.recipientId.toString(),
            notificationId: notification.id.toString()
        })

        expect(result.isRight()).toBe(true)
        expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(expect.any(Date))

    })

    it('should not be able to read Notification from another user', async () => {
        
        const notification = await makeNotification()

        await inMemoryNotificationsRepository.create(notification)

        const result = await sut.execute({
            recipientId: 'not-uuid',
            notificationId: notification.id.toString()
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(NotAllowedError)
        expect(inMemoryNotificationsRepository.items[0].readAt).toEqual(undefined)

    })
})