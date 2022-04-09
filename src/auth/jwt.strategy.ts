import { PassportStrategy } from '@nestjs/passport'
import { Injectable } from '@nestjs/common'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { User } from 'src/users/entities/user.entity'
import { JwtPayload } from './auth.service'
import { UsersService } from 'src/users/users.service'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly userService: UsersService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: 'somesecret',
        })
    }

    async validate(payload: JwtPayload): Promise<User> {
        console.log('JwtStrategy.validate')
        return this.userService.findOne(payload.sub)
    }
}
