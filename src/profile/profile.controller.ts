import { Controller, Get, Request, UseGuards } from '@nestjs/common'

import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { User } from '../users/entities/user.entity'

@UseGuards(JwtAuthGuard)
@Controller('profile')
export class ProfileController {
    @Get()
    async index(@Request() request) {
        return new User(request.user) // need to find a way to exclude password
    }
}
