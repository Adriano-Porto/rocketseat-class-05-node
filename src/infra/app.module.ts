import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { envSchema } from './env/env'
import { AuthModule } from './auth/auth.module'
import { HttpModule } from './http/http.module'
import { EnvModule } from './env/env.module'
import { EventsModule } from './events/events.module'

@Module({
    imports: [ConfigModule.forRoot({
        validate: environmentVariables => envSchema.parse(environmentVariables), // Checks if environment variables are valid 
        isGlobal: true,
    }),
    AuthModule,
    HttpModule,
    EnvModule,
    EventsModule
    ],
})

export class AppModule {}