import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRespository } from '../respositories/questions-repository'
import { Either, right } from '@/core/either'
import { QuestionAttachment } from '../../enterprise/entities/question-attachment'
import { QuestionAttachmentList } from '../../enterprise/entities/question-attachment-list'
import { Injectable } from '@nestjs/common'

interface CreateQuestionUseCaseInput {
    authorId: string,
    title: string,
    content: string,
    attachmentsIds: string[]
}

type CreateQuestionUseCaseOutput = Either<null, { 
    question: Question
}>

@Injectable()
export class CreateQuestionUseCase {
    constructor(private questionsRepository: QuestionsRespository) {}

    async execute({
        authorId,
        title,
        content,
        attachmentsIds
    }: CreateQuestionUseCaseInput): Promise<CreateQuestionUseCaseOutput> {
        
        const question = Question.create({
            authorId: new UniqueEntityID(authorId),
            title,
            content
        })

        const questionAttachments = attachmentsIds.map(attachmentId => {
            return QuestionAttachment.create({
                attachmentId: new UniqueEntityID(attachmentId),
                questionId: question.id
            })
        })
        

        question.attachments = new QuestionAttachmentList(questionAttachments)

        await this.questionsRepository.create(question)
        

        return right({
            question
        })
    }
}