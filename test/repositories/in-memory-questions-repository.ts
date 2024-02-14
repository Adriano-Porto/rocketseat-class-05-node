import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionsRespository } from '@/domain/forum/application/respositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'
import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { InMemoryAttachmentsRepository } from './in-memory-attachments-repository'
import { InMemoryStudentsRepository } from './in-memory-students-repository'
import { InMemoryQuestionAttachmentRepository } from './in-memory-questions-attachments-repository'

export class InMemoryQuestionsRepository implements QuestionsRespository {
    public items: Question[] = []
    
    constructor (
        private questionAttachmentsRepository: InMemoryQuestionAttachmentRepository,
        private attachmentsReposiotry: InMemoryAttachmentsRepository,
        private studentsRepository: InMemoryStudentsRepository
    ) {}

    async create(question: Question) {
        this.items.push(question)
        await this.questionAttachmentsRepository.createMany(question.attachments.getItems())
        DomainEvents.dispatchEventsForAggregate(question.id)

    }
    
    async save(question: Question) {
        const itemIndex = this.items.findIndex((item) => item.id === question.id)

        this.items[itemIndex] = question
        await this.questionAttachmentsRepository.createMany(question.attachments.getNewItems())
        await this.questionAttachmentsRepository.deleteMany(question.attachments.getRemovedItems())

        DomainEvents.dispatchEventsForAggregate(question.id)
    }

    async delete(question: Question): Promise<void> {
        const itemIndex = this.items.findIndex(item => item.id === question.id)
        this.items.splice(itemIndex, 1)
        this.questionAttachmentsRepository.deleteManyByQuestionId(
            question.id.toString()
        )
    }
    async findById(id: string): Promise<Question | null> {
        const question = this.items.find(item => item.id.toString() === id)
        if (!question) return null

        return question
    }

    async findBySlug(slug: string): Promise<Question | null> {
        const question = this.items.find(item => item.slug.value === slug)

        if(!question) return null
        
        return question
    }

    async findDetailsBySlug(slug: string): Promise<QuestionDetails | null> {
        const question = this.items.find(item => item.slug.value === slug)

        if(!question) return null

        const author = this.studentsRepository.items.find(student => {
            return student.id.equals(question.authorId)
        })

        if(!author) throw new Error(`Author with id ${question.authorId.toString()} does not exists`)
        

        const questionAttachments = this.questionAttachmentsRepository.items.filter(questionAttachments =>  {
            return questionAttachments.questionId.equals(question.id)
        })

        const attachments = questionAttachments.map(questionAttachments => {
            const attachment = this.attachmentsReposiotry.items.find(attachment => {
                return attachment.id.equals(questionAttachments.attachmentId)
            })
            if(!attachment) throw new Error(`Attachment with id ${attachment.id.toString()} does not exists`)
            return attachment
        })
        
        return QuestionDetails.create({
            questionId: question.id,
            authorId: question.authorId,
            author: author.name,
            title: question.title,
            slug: question.slug,
            content: question.content,
            bestAnswerId: question.bestAnswerId,
            attachments,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt

        })
    }

    async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
        const questions = await this.items
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice((page -1 ) * 20, page * 20)

        return questions
    }

}
