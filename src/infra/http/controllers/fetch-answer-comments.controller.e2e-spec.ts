import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { AnswerCommentFactory } from 'test/factories/make-answer-comment'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Fetch question answercomments (E2E)', () => {
    let app: INestApplication
    let jwt: JwtService
    
    let studentFactory: StudentFactory
    let questionFactory: QuestionFactory
    let answerFactory: AnswerFactory
    let answercommentFactory: AnswerCommentFactory

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory, AnswerCommentFactory, AnswerFactory]
        }).compile()

        app = moduleRef.createNestApplication()

        jwt = moduleRef.get(JwtService)

        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        answercommentFactory = moduleRef.get(AnswerCommentFactory)
        answerFactory = moduleRef.get(AnswerFactory)

        await app.init()
    })

    test('[GET] /answer/:answerId/comments', async () => {
        const user = await studentFactory.makePrismaStudent()

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id
        })

        const answer = await answerFactory.makePrismaAnswer({
            authorId: user.id,
            questionId: question.id
        })
        
        await Promise.all([
            answercommentFactory.makePrismaAnswerComment({
                authorId: user.id,
                answerId: answer.id,
                content: 'comment 01',
            }),
            answercommentFactory.makePrismaAnswerComment({
                authorId: user.id,
                answerId: answer.id,
                content: 'comment 02',
            })
        ])

        const accessToken = jwt.sign({sub: user.id.toString()})

        const answerId = answer.id.toString()

        const response = await request(app.getHttpServer())
            .get(`/answer/${answerId}/comments`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send()

        expect(response.statusCode).toBe(200)
        expect(response.body.comments).toHaveLength(2)
        expect(response.body.comments).toEqual(expect.arrayContaining([
            expect.objectContaining({ content: 'comment 01'}),
            expect.objectContaining({ content: 'comment 02'}),
        ]))
    })
})