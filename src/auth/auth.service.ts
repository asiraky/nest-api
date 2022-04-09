import { Injectable, NotFoundException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { compare } from 'bcrypt'
import { promisify } from 'util'

import { User } from 'src/users/entities/user.entity'
import { UsersService } from 'src/users/users.service'

const compareAsync = promisify(compare)

export type JwtPayload = {
    email: string
    sub: string
}

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async validatePassword(email: string, password: string): Promise<User> {
        const user = await this.usersService.findOne(email)
        if (!user) {
            throw new NotFoundException()
        }

        if (compareAsync(password, user.password)) {
            return user
        }

        return null
    }

    async login(user: User) {
        const payload: JwtPayload = {
            email: user.email,
            sub: user.id,
        }
        return {
            access_token: this.jwtService.sign(payload),
        }
    }
}
