import { Either, left, right } from '@/core/either'
import { Student } from '../../enterprise/entities/student'
import { StudentsRespository } from '../respositories/students-repository'
import { HashGenerator } from '../cryptography/hasher-generator'
import { StudentAlreadyExistsError } from './errors/student-already-exists'
import { Injectable } from '@nestjs/common'

interface RegisterStudentUseCaseInput {
    name: string
    email: string
    password: string
}

type RegisterStudentUseCaseOutput = Either<StudentAlreadyExistsError, { 
    student: Student
 }>

@Injectable()
export class RegisterStudentUseCase {
    constructor(
        private studentsRepository: StudentsRespository,
        private hashGenerator: HashGenerator
    ) {}

    async execute({
        name,
        email,
        password
    }: RegisterStudentUseCaseInput): Promise<RegisterStudentUseCaseOutput> {

        const userWithSameEmail = await this.studentsRepository.findByEmail(email)

        if (userWithSameEmail) 
            return left(new StudentAlreadyExistsError('e-mail'))

        const hashedPassword = await this.hashGenerator.hash(password)

        const student = await Student.create({
            name, 
            email,
            password: hashedPassword,
        })

        await this.studentsRepository.create(student)

        return right({
            student
        })
    }
}