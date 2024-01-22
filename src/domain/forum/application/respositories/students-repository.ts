import { Student } from '../../enterprise/entities/student'

export abstract class StudentsRespository {
    abstract create(student: Student): Promise<void>
    abstract findByEmail(id: string): Promise<Student | null>
}