import { PaginationParams } from '@/core/repositories/pagination-params'
import { Answer } from '../../enterprise/entities/answer'

export abstract class AnswersRespository {
    abstract create(answer: Answer): Promise<void>
    abstract save(question: Answer): Promise<void>
    abstract delete(answer: Answer): Promise<void>
    abstract findById(id: string): Promise<Answer | null>
    abstract findManyByQuestionId(questionId: string, params: PaginationParams): Promise<Answer[]>
}