import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Optional } from '@/core/types/optional'
import { AnswerAttachmentList } from './answer-attachment-list'
import { AggregateRoot } from '@/core/entities/aggregate-root'
import { AnswerCreatedAEvent } from '../../events/answer-created-events'

export interface AnswerProps {
    content: string,
    authorId: UniqueEntityID,
    questionId: UniqueEntityID,
    attachments: AnswerAttachmentList
    createdAt: Date,
    updatedAt?: Date
}

export class Answer extends AggregateRoot <AnswerProps>{
    get content(){
        return this.props.content
    }

    get authorId(){
        return this.props.authorId
    }

    get questionId(){
        return this.props.questionId
    }

    get attachments(){
        return this.props.attachments
    }
    get createdAt(){
        return this.props.createdAt
    }
    get updatedAt(){
        return this.props.updatedAt
    }

    get excerpt() {
        return this.content.substring(0, 120).trimEnd().concat('...')
    }

    set attachments(attachments: AnswerAttachmentList){
        this.props.attachments = attachments
        this.touch()
    }

    private touch() {
        this.props.updatedAt = new Date()
    }

    set content(content: string) {
        this.props.content = content
        this.touch()
    }

    static create(props: Optional<AnswerProps, 'createdAt' | 'attachments'> , id?: UniqueEntityID) {
        const answer = new Answer({
            createdAt: new Date(),
            attachments: new AnswerAttachmentList(),
            ...props,
        }, id)

        const isNewAnswer = !id

        if (isNewAnswer) {
            answer.addDomainEvent(new AnswerCreatedAEvent(answer))

        }
        return answer
    }
}