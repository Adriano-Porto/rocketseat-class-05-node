import { AnswerCommentsRepository } from '@/domain/forum/application/respositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
    public items: AnswerComment[] = []

    constructor(
        private studentsRepository: InMemoryStudentsRepository
    ) {}

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

    async findManyByAnswerIdWithAuthor(answerId: string, { page }: PaginationParams): Promise<CommentWithAuthor[]> {
        const questionComments = await this.items
            .filter((item) => item.answerId.toString() === answerId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice((page -1 ) * 20, page * 20)
            .map(comment => {
                const author = this.studentsRepository.items.find(student => {
                    return student.id.equals(comment.authorId)
                })

                if(!author) throw new Error(`Author with id: "${comment.authorId}"does not exists`)

                return CommentWithAuthor.create({
                    commentId: comment.id,
                    content: comment.content,
                    createdAt: comment.createdAt,
                    updatedAt: comment.updatedAt,
                    authorId: comment.authorId,
                    author: author.name
                })
            })

        return questionComments
    }
    
}