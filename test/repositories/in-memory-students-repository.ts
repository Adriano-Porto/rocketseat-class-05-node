import { DomainEvents } from '@/core/events/domain-events'
import { StudentsRespository } from '@/domain/forum/application/respositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'

export class InMemoryStudentsRepository implements StudentsRespository {
    public items: Student[] = []
    
    constructor (
    ) {}
    async create(student: Student): Promise<void> {
        this.items.push(student)
        DomainEvents.dispatchEventsForAggregate(student.id)
        
        
    }
    async findByEmail(email: string): Promise<Student> {
        const student = this.items.find(item => item.email === email)
        if (!student) return null

        return student
    }


}
