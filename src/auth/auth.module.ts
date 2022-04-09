import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'

import { UsersModule } from 'src/users/users.module'
import { AuthService } from './auth.service'
import { LocalStrategy } from './local.strategy'

@Module({
    providers: [AuthService, LocalStrategy],
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.register({
            secret:
                (console.log(process.env.JWT_SECRET), process.env.JWT_SECRET),
            signOptions: {
                expiresIn: '30d',
            },
        }),
    ],
    exports: [AuthService],
})
export class AuthModule {}
