import { StudentsRespository } from '@/domain/forum/application/respositories/students-repository'
import { Student } from '@/domain/forum/enterprise/entities/student'
import { PrismaService } from '../prisma.service'
import { PrismaStudentMapper } from '../mappers/prisma-student-mapper'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaStudentsRepository implements StudentsRespository {
    constructor(private prisma: PrismaService) {}

    async create(student: Student): Promise<void> {
        await this.prisma.user.create({
            data: PrismaStudentMapper.toPrisma(student)
        })
    }
    
    async findByEmail(email: string): Promise<Student> {
        const user = await this.prisma.user.findUnique({
            where: { email }
        })

        if (!user) return null

        return PrismaStudentMapper.toDomain(user)
    }

}