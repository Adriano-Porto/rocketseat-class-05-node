import { PaginationParams } from '@/core/repositories/pagination-params'
import { Answer } from '../../enterprise/entities/answer'

export interface AnswersRespository {
    create(answer: Answer): Promise<void>
    save(question: Answer): Promise<void>
    delete(answer: Answer): Promise<void>
    findById(id: string): Promise<Answer | null>
    findManyByQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]>
}