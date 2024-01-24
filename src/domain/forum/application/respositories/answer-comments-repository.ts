import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerComment } from '../../enterprise/entities/answer-comment'

export abstract class AnswerCommentsRepository {
    abstract create(answer: AnswerComment): Promise<void>
    abstract delete(answer: AnswerComment): Promise<void>
    abstract findById(id: string): Promise<AnswerComment | null>
    abstract findManyByAnswerId(questionId: string, params: PaginationParams): Promise<AnswerComment[]>

}