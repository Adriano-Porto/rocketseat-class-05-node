import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { QuestionAttachmentsRepository } from '@/domain/forum/application/respositories/question-attachments-repository'
import { QuestionsRespository } from '@/domain/forum/application/respositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRespository {
    public items: Question[] = []
    
    constructor (
        private questionAttachmentsRepository: QuestionAttachmentsRepository
    ) {}

    async create(question: Question) {
        this.items.push(question)
        DomainEvents.dispatchEventsForAggregate(question.id)

    }
    
    async save(question: Question) {
        const itemIndex = this.items.findIndex((item) => item.id === question.id)

        this.items[itemIndex] = question

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
    async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
        const questions = await this.items
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice((page -1 ) * 20, page * 20)

        return questions
    }

}
