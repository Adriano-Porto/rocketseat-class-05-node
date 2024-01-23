import { expect, describe, it } from 'vitest'
import { FakeHasher } from 'test/cryptography/fake-hasher'
import { AuthenticateStudentUseCase } from './Authenticate-student'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { FakeEncrypter } from 'test/cryptography/fake-encrypter'
import { makeStudent } from 'test/factories/make-student'
import { WrongCredentialsError } from './errors/wrong-credentials-error'

let inMemoryStudentsRepository: InMemoryStudentsRepository
let fakeHasher: FakeHasher
let fakeEncrypter: FakeEncrypter

let sut: AuthenticateStudentUseCase

describe('Authenticate Student', () => {
    beforeEach(() => {
        inMemoryStudentsRepository = new InMemoryStudentsRepository()

        fakeHasher = new FakeHasher()
        fakeEncrypter = new FakeEncrypter()

        sut = new AuthenticateStudentUseCase(inMemoryStudentsRepository, fakeHasher, fakeEncrypter)
    })
    it('should be able to authenticate student', async () => {
        const student = await makeStudent({
            email: 'johndoe@example.com',
            password: await fakeHasher.hash('123456')
        })

        inMemoryStudentsRepository.items.push(student)

        const result = await sut.execute({
            email: 'johndoe@example.com',
            password: '123456'
        })

        expect(result.isRight()).toBe(true)
        expect(result.value).toEqual({
            accessToken: expect.any(String)
        })
    })

    it('should not be able to not log in with wrong password', async () => {
        const student = await makeStudent({
            email: 'johndoe@example.com',
            password: await fakeHasher.hash('123456')
        })

        inMemoryStudentsRepository.items.push(student)

        const result = await sut.execute({
            email: 'johndoe@example.com',
            password: '123457'
        })

        expect(result.isLeft()).toBe(true)
        expect(result.value).toBeInstanceOf(WrongCredentialsError)
    })
})