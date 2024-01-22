import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswersRespository } from '@/domain/forum/application/respositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaAnswersRepository implements AnswersRespository {
    create(answer: Answer): Promise<void> {
        throw new Error('Method not implemented.')
    }
    save(question: Answer): Promise<void> {
        throw new Error('Method not implemented.')
    }
    delete(answer: Answer): Promise<void> {
        throw new Error('Method not implemented.')
    }
    findById(id: string): Promise<Answer> {
        throw new Error('Method not implemented.')
    }
    findManyByQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]> {
        throw new Error('Method not implemented.')
    }
}