import { faker } from '@faker-js/faker'

import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Student, StudentProps } from '@/domain/forum/enterprise/entities/student'

export async function makeStudent(override: Partial<StudentProps> = {}, id?: UniqueEntityID) {
    const student = await Student.create({
        name: faker.person.fullName(),
        email: faker.internet.email(),
        password: faker.internet.password(),
        ...override
    }, id)

    return student
}