import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { Comment as PrismaComment, User as PrismaAuthor } from '@prisma/client'

type PrismaCommentWithAuthor = PrismaComment & {
    author: PrismaAuthor
}

export class PrismaCommentWithAuthorMapper {
    static toDomain(raw: PrismaCommentWithAuthor): CommentWithAuthor {
        return CommentWithAuthor.create({
            commentId: new UniqueEntityID(raw.id),
            authorId: new UniqueEntityID(raw.authorId),
            author: raw.author.name,
            content: raw.content,
            createdAt: raw.createdAt,
            updatedAt: raw.updatedAt
        })
    }
}