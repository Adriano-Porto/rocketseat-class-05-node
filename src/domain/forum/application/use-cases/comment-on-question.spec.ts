import { expect, describe, it } from 'vitest'
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions-repository'
import { CommentOnQuestionUseCase } from './comment-on-question'
import { InMemoryQuestionCommentRepository } from 'test/repositories/in-memory-question-comments-repository'
import { makeQuestion } from 'test/factories/make-question'
import { InMemoryQuestionAttachmentRepository } from 'test/repositories/in-memory-questions-attachments-repository'
import { InMemoryStudentsRepository } from 'test/repositories/in-memory-students-repository'
import { InMemoryAttachmentsRepository } from 'test/repositories/in-memory-attachments-repository'

let inMemoryQuestionsRepository: InMemoryQuestionsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentRepository
let sut: CommentOnQuestionUseCase
let inMemoryStudentsRepository: InMemoryStudentsRepository
let inMemoryAttachmentsRepository: InMemoryAttachmentsRepository

let inMemoryQuestionAttachmentRepository: InMemoryQuestionAttachmentRepository

describe('Create Question', () => {
    beforeEach(() => {
        inMemoryStudentsRepository = new InMemoryStudentsRepository()
        inMemoryAttachmentsRepository = new InMemoryAttachmentsRepository() 
        inMemoryQuestionAttachmentRepository = new InMemoryQuestionAttachmentRepository()
        inMemoryQuestionsRepository = new InMemoryQuestionsRepository(inMemoryQuestionAttachmentRepository, inMemoryAttachmentsRepository, inMemoryStudentsRepository)
        inMemoryQuestionCommentsRepository = new InMemoryQuestionCommentRepository(inMemoryStudentsRepository)
        sut = new CommentOnQuestionUseCase(inMemoryQuestionsRepository, inMemoryQuestionCommentsRepository)
    })
    it('should be able to create question', async () => {
        const question = await makeQuestion()

        await inMemoryQuestionsRepository.create(question)

        await sut.execute({
            questionId: question.id.toString(),
            authorId: question.authorId.toString(),
            content: 'lorem ipsum dolor it'
        })

        expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual('lorem ipsum dolor it')
    })
})