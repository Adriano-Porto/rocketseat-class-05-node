import { AppModule } from '@/infra/app.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import { hash } from 'bcryptjs'
import request from 'supertest'

describe('Create Account (E2E)', () => {
    let app: INestApplication
    let prisma: PrismaService
    let jwt: JwtService

    beforeAll(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [AppModule],
        }).compile()

        app = moduleRef.createNestApplication()

        prisma = moduleRef.get(PrismaService)
        jwt = moduleRef.get(JwtService)
        await app.init()
    })

    test('[POST] /questions', async () => {
        const user = await prisma.user.create({
            data: {
                name: 'John Doe',
                email: 'johndoe@example.com',
                password: await hash('123456', 8),
            },
        })

        await prisma.question.createMany({
            data: [
                {
                    title: 'question 1',
                    slug: 'question-1',
                    content: 'question 1 content',
                    authorId: user.id,
                    
                },
                {
                    title: 'question 2',
                    slug: 'question-2',
                    content: 'question 2 content',
                    authorId: user.id,
                    
                },
                {
                    title: 'question 3',
                    slug: 'question-3',
                    content: 'question 3 content',
                    authorId: user.id,
                    
                },
                
            ]
        })
        
        const accessToken = jwt.sign({sub: user.id})

        const response = await request(app.getHttpServer())
            .get('/questions')
            .set('Authorization', `Bearer ${accessToken}`)
            .send()

        expect(response.statusCode).toBe(200)
        expect(response.body).toEqual({
            questions: [
                expect.objectContaining({title: 'question 1'}),
                expect.objectContaining({title: 'question 2'}),
                expect.objectContaining({title: 'question 3'})
            ]
        })
    })
})