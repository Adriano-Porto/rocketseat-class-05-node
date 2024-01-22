import {  Body, Controller, Post, UnauthorizedException, UsePipes } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcryptjs'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { z } from 'zod'

const AuthenticateBodySchema = z.object({
    email: z.string().email(),
    password: z.string()
})

type AuthenticateBodySchema = z.infer<typeof AuthenticateBodySchema>

@Controller('/session')
export class AuthenticateController {
    constructor(private jwtService: JwtService, private prisma: PrismaService) {}

    @Post()
    @UsePipes(new ZodValidationPipe(AuthenticateBodySchema))
    async handle(@Body() body: AuthenticateBodySchema) {
        const { email, password } = body
        
        const user = await this.prisma.user.findUnique({
            where: {
                email
            }
        })

        if (!user) throw new UnauthorizedException('User Credentials do not match')

        const isPasswordValid = await compare(password, user.password)
        if (!isPasswordValid) throw new UnauthorizedException('User Credentials do not match') 

        
        const token = this.jwtService.sign({
            sub: user.id
        })

        return {
            access_token: token
        }
    }
}