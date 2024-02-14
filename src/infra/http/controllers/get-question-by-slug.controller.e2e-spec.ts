import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'
import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AttachmentFactory } from 'test/factories/make-attachment'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionAttachmentFactory } from 'test/factories/make-question-attachment'
import { StudentFactory } from 'test/factories/make-student'

describe('Get Question By Slug (E2E)', () => {
    let app: INestApplication
    let studentFactory: StudentFactory
    let questionFactory: QuestionFactory
    let attachmentFactory: AttachmentFactory
    let questionAttachmentsFactory: QuestionAttachmentFactory

    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory, AttachmentFactory, QuestionAttachmentFactory]
        }).compile()

        app = moduleRef.createNestApplication()

        jwt = moduleRef.get(JwtService)
        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)


        attachmentFactory = moduleRef.get(AttachmentFactory)
        questionAttachmentsFactory = moduleRef.get(QuestionAttachmentFactory)

        await app.init()
    })

    test('[GET] /questions/:slug', async () => {
        const user = await studentFactory.makePrismaStudent({
            name: 'John Doe'
        })

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id,
            title: 'question 1',
            slug: Slug.create('question-1')
        })
        
        const attachment = await attachmentFactory.makePrismaAttachment({
            title: 'attachment'
        })

        await questionAttachmentsFactory.makePrismaQuestionAttachment({
            attachmentId: attachment.id,
            questionId: question.id
        })

        const accessToken = jwt.sign({sub: user.id.toString()})

        const response = await request(app.getHttpServer())
            .get('/questions/question-1')
            .set('Authorization', `Bearer ${accessToken}`)
            .send()

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            question: expect.objectContaining({
                slug: 'question-1',
                author: 'John Doe',
                attachments: [
                    expect.objectContaining({
                        title: 'attachment'
                    })
                ]
            })
        })
    })
})