import { Body, UseGuards } from '@nestjs/common'
import { Controller, Post } from '@nestjs/common'
import { CurrentUser } from '@/auth/current-user-decorator'
import { JwtAuthGuard } from '@/auth/jwt-auth.guard'
import { UserPayload } from '@/auth/jwt.strategy'
import { ZodValidationPipe } from '@/pipes/zod-validation-pipe'
import { PrismaService } from '@/prisma/prisma.service'
import { z } from 'zod'

const createQuestionBodySchema = z.object({
    title: z.string(),
    content: z.string(),

})

type CreateQuestionBodySchema = z.infer<typeof createQuestionBodySchema>


@Controller('/questions')
@UseGuards(JwtAuthGuard)
export class CreateQuestionController {

    constructor(private prisma: PrismaService) {}

    @Post()
    // async handle(@Request() request: Request) {}
    async handle(
        @Body(new ZodValidationPipe(createQuestionBodySchema)) body: CreateQuestionBodySchema,
        @CurrentUser() user: UserPayload
    ) {
        const { title, content } = body
        const { sub: authorId } = user

        const slug = this.generateSlug(this.generateSlug(title))

        await this.prisma.question.create({
            data: {
                authorId,
                title,
                content,
                slug
            }
        })
    }

    private generateSlug(input: string): string {
        // Convert to lowercase and replace spaces with hyphens
        const slug = input.toLowerCase().replace(/\s+/g, '-')
      
        // Remove special characters
        const sanitizedSlug = slug.replace(/[^\w-]+/g, '')
      
        // Remove two or more consecutive hyphens
        const noConsecutiveHyphensSlug = sanitizedSlug.replace(/-{2,}/g, '-')
      
        // Remove hyphens at the beginning and end of the string
        const finalSlug = noConsecutiveHyphensSlug.replace(/^-+|-+$/g, '')
      
        return finalSlug
    }
}