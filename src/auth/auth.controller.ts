import { Controller, Post, Request, UseGuards } from '@nestjs/common'

import { LocalAuthGuard } from './local-auth.guard'
import { AuthService } from './auth.service'
import { UsersService } from '../users/users.service'

@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly usersService: UsersService,
    ) {}

    @UseGuards(LocalAuthGuard)
    @Post('login')
    login(@Request() req) {
        return this.authService.login(req.user)
    }
}
