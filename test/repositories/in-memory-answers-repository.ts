import { DomainEvents } from '@/core/events/domain-events'
import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerAttachmentsRepository } from '@/domain/forum/application/respositories/answer-attachments-repository'
import { AnswersRespository } from '@/domain/forum/application/respositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRespository {
    public items: Answer[] = []

    constructor (
        private answerAttachmentsRepository: AnswerAttachmentsRepository
    ) {}

    async create(answer: Answer) {
        this.items.push(answer)
        await this.answerAttachmentsRepository.createMany(answer.attachments.getItems())
        DomainEvents.dispatchEventsForAggregate(answer.id)
    }

    async save(answer: Answer) {
        const itemIndex = this.items.findIndex((item) => item.id === answer.id)
        this.items[itemIndex] = answer

        await this.answerAttachmentsRepository.createMany(answer.attachments.getNewItems())
        await this.answerAttachmentsRepository.deleteMany(answer.attachments.getRemovedItems())

        DomainEvents.dispatchEventsForAggregate(answer.id)
    }
    
    async delete(answer: Answer): Promise<void> {
        const itemIndex = this.items.findIndex(item => item.id === answer.id)
        this.items.splice(itemIndex, 1)
        this.answerAttachmentsRepository.deleteManyByAnswerId(answer.id.toString())
    }

    async findById(id: string): Promise<Answer | null> {
        const answer = this.items.find(item => item.id.toString() === id)
        if (!answer) return null

        return answer
    }

    async findManyByQuestionId(questionId: string, { page }: PaginationParams): Promise<Answer[]> {
        const answers = await this.items
            .filter((item) => item.questionId.toString() === questionId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice((page -1 ) * 20, page * 20)

        return answers
    }

}