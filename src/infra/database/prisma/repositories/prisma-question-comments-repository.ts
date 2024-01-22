import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionCommentsRepository } from '@/domain/forum/application/respositories/question-comments-repository'
import { QuestionComment } from '@/domain/forum/enterprise/entities/question-comment'
import { Injectable } from '@nestjs/common'

@Injectable()
export class PrismaQuestionCommentsRepository implements QuestionCommentsRepository {
    create(question: QuestionComment): Promise<void> {
        throw new Error('Method not implemented.')
    }
    delete(question: QuestionComment): Promise<void> {
        throw new Error('Method not implemented.')
    }
    findById(id: string): Promise<QuestionComment> {
        throw new Error('Method not implemented.')
    }
    findManyByQuestionId(questionId: string, params: PaginationParams): Promise<QuestionComment[]> {
        throw new Error('Method not implemented.')
    }

}