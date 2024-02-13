import { Either, right } from '@/core/either'
import { QuestionCommentsRepository } from '../respositories/question-comments-repository'
import { Injectable } from '@nestjs/common'
import { CommentWithAuthor } from '../../enterprise/entities/value-objects/comment-with-author'

interface FetchQuestionUseCaseInput {
    questionId: string
    page: number
}

type FetchQuestionUseCaseOutput = Either<null, { 
    comments: CommentWithAuthor[]
 }>

@Injectable()
export class FetchQuestionCommentsUseCase {
    constructor(private questionCommentRepository: QuestionCommentsRepository) {}

    async execute({
        page,
        questionId
    }: FetchQuestionUseCaseInput): Promise<FetchQuestionUseCaseOutput> {
        const comments = await this.questionCommentRepository.findManyByQuestionIdWithAuthor(questionId, { page })

        return right({ comments })
    }
}