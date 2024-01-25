import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { QuestionFactory } from 'test/factories/make-question'
import { QuestionCommentFactory } from 'test/factories/make-question-comment'
import { StudentFactory } from 'test/factories/make-student'

describe('Delete QuestionComment (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let jwt: JwtService
    let questionFactory: QuestionFactory
    let questioncommentFactory: QuestionCommentFactory
    let studentFactory: StudentFactory

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule, DatabaseModule],
            providers: [StudentFactory, QuestionFactory, QuestionCommentFactory]
        }).compile()

        app = moduleRef.createNestApplication()
        studentFactory = moduleRef.get(StudentFactory)
        questionFactory = moduleRef.get(QuestionFactory)
        questioncommentFactory = moduleRef.get(QuestionCommentFactory)
        prisma = moduleRef.get(PrismaService)
        jwt = moduleRef.get(JwtService)
        await app.init()
    })

    test('[DELETE] /questioncomments/:id', async () => {
        const user = await studentFactory.makePrismaStudent()
        
        const accessToken = jwt.sign({sub: user.id.toString()})

        const question = await questionFactory.makePrismaQuestion({
            authorId: user.id
        })

        const questioncomment = await questioncommentFactory.makePrismaQuestionComment({
            authorId: user.id,
            questionId: question.id
        })

        const questioncommentId = questioncomment.id.toString()

        const response = await request(app.getHttpServer())
            .delete(`/question/comments/${questioncommentId}`)
            .set('Authorization', `Bearer ${accessToken}`)
            .send()

        

        expect(response.statusCode).toBe(204)

        const questioncommentOnDatabase = await prisma.comment.findFirst({
            where: {
                id: questioncomment.id.toString()
            },
        })

        expect(questioncommentOnDatabase).toBeNull()
    })
})