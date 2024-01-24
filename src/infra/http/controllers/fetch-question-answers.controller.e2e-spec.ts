import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AnswerFactory } from 'test/factories/make-answer'
import { QuestionFactory } from 'test/factories/make-question'
import { StudentFactory } from 'test/factories/make-student'

describe('Fetch question answers (E2E)', () => {
    let app: INestApplication
    let jwt: JwtService
    
    let studentFactory: StudentFactory
    let questionFactory: QuestionFactory
    let answerFactory: AnswerFactory

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory, AnswerFactory]
        }).compile()

        app = moduleRef.createNestApplication()

        jwt = moduleRef.get(JwtService)

        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        answerFactory = moduleRef.get(AnswerFactory)

        await app.init()
    })

    test('[GET] /question/:questionId/answers', async () => {
        const user = await studentFactory.makePrismaStudent()

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id
        })
        
        await Promise.all([
            answerFactory.makePrismaAnswer({
                authorId: user.id,
                questionId: question.id,
                content: 'answer 01',
            }),
            answerFactory.makePrismaAnswer({
                authorId: user.id,
                questionId: question.id,
                content: 'answer 02',
            })
        ])

        const accessToken = jwt.sign({sub: user.id.toString()})

        const questionId = question.id.toString()

        const response = await request(app.getHttpServer())
            .get(`/question/${questionId}/answers`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send()

        expect(response.statusCode).toBe(200)
        expect(response.body.answers).toHaveLength(2)
        expect(response.body.answers).toEqual(expect.arrayContaining([
            expect.objectContaining({ content: 'answer 01'}),
            expect.objectContaining({ content: 'answer 02'}),
        ]))
    })
})