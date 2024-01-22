import { Either, left, right } from '@/core/either'
import { StudentsRespository } from '../respositories/students-repository'
import { HashComparer } from '../cryptography/hasher-comparer'
import { WrongCredentialsError } from './errors/wrong-credentials-error'
import { Encrypter } from '../cryptography/encrypter'

interface AuthenticateStudentUseCaseInput {
    email: string
    password: string
}

type AuthenticateStudentUseCaseOutput = Either<WrongCredentialsError, { 
    accessToken: string
}>
export class AuthenticateStudentUseCase {
    constructor(
        private studentsRepository: StudentsRespository,
        private hashCompare: HashComparer,
        private encrypter: Encrypter
    ) {}

    async execute({
        email,
        password
    }: AuthenticateStudentUseCaseInput): Promise<AuthenticateStudentUseCaseOutput> {
        const student = await this.studentsRepository.findByEmail(email)

        if (!student) 
            return left(new WrongCredentialsError())


        const isPasswordValid = await this.hashCompare.compare(password, student.password)
        
        if (!isPasswordValid) return left(new WrongCredentialsError())
    
        const accessToken = await this.encrypter.encrypt({sub: student.id.toString()})

        return right({
            accessToken
        })
    }
}