import { AnswerCommentsRepository } from '@/domain/forum/application/respositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { PaginationParams } from '@/core/repositories/pagination-params'

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
    public items: AnswerComment[] = []

    async create(answerComment: AnswerComment) {
        this.items.push(answerComment)
    }

    async delete(answercomment: AnswerComment): Promise<void> {
        const itemIndex = this.items.findIndex(item => item.id === answercomment.id)
        this.items.splice(itemIndex, 1)
    }

    async findById(id: string): Promise<AnswerComment | null> {
        const answercomment = this.items.find(item => item.id.toString() === id)
        if (!answercomment) return null

        return answercomment
    }

    async findManyByAnswerId(questionId: string, { page }: PaginationParams): Promise<AnswerComment[]> {
        const questioncomments = await this.items
            .filter((item) => item.answerId.toString() === questionId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice((page -1 ) * 20, page * 20)

        return questioncomments
    }
    
}