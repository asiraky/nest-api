import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseInterceptors,
    ClassSerializerInterceptor,
    NotFoundException,
    Request,
    UnauthorizedException,
    UseGuards,
    BadRequestException,
} from '@nestjs/common'

import { UsersService } from './users.service'
import { CreateUserDto } from '../users/dto/create-user.dto'
import { UpdateUserDto } from '../users/dto/update-user.dto'
import { CaslAbilityFactory } from '../casl/casl-ability.factory'
import { Action } from '../casl/constants'
import { User } from './entities/user.entity'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'

@UseGuards(JwtAuthGuard)
@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
    constructor(
        private readonly usersService: UsersService,
        private readonly caslAbilityFactory: CaslAbilityFactory,
    ) {}

    @Post()
    async create(@Request() request, @Body() createUserDto: CreateUserDto) {
        const ability = this.caslAbilityFactory.createForUser(request.user)

        if (!ability.can(Action.Create, User)) {
            throw new UnauthorizedException(
                "You're not allowed to create users",
            )
        }

        return this.usersService.create(createUserDto)
    }

    @Get()
    async findAll(@Request() request) {
        const ability = this.caslAbilityFactory.createForUser(request.user)
        const results = await this.usersService.findAll()

        // i dunno how i feel about this. only returning elements from the list that user can read
        const allowedResults = results.filter((user) =>
            ability.can(Action.Read, user),
        )

        if (results.length > 0 && allowedResults.length === 0) {
            throw new UnauthorizedException(
                'There are no users available that you have permission to see',
            )
        }

        return allowedResults
    }

    @Get(':id')
    async findOne(@Request() request, @Param('id') id: string) {
        const user = await this.usersService.findOne(id)

        if (!user) {
            throw new NotFoundException()
        }

        const ability = this.caslAbilityFactory.createForUser(request.user)

        if (!ability.can(Action.Read, user)) {
            throw new UnauthorizedException(
                'You are not allowed to see this user',
            )
        }

        return user
    }

    @Patch(':id')
    async update(
        @Request() request,
        @Param('id') id: string,
        @Body() updateUserDto: UpdateUserDto,
    ) {
        if (Object.keys(updateUserDto).length === 0) {
            throw new BadRequestException('Nothing to update')
        }

        const user = await this.usersService.findOne(id)

        if (!user) {
            throw new NotFoundException()
        }

        const fieldsToBeUpdated = Object.keys(updateUserDto).filter(
            (k) => k !== undefined,
        )

        const ability = this.caslAbilityFactory.createForUser(request.user)

        for (let index = 0; index < fieldsToBeUpdated.length; index++) {
            const field = fieldsToBeUpdated[index]

            if (!ability.can(Action.Update, user, field)) {
                throw new UnauthorizedException(
                    `You are not allowed to update the ${field} field for this user`,
                )
            }
        }

        this.usersService.update(id, updateUserDto)
    }

    @Delete(':id')
    async remove(@Request() request, @Param('id') id: string) {
        const user = await this.usersService.findOne(id)
        const ability = this.caslAbilityFactory.createForUser(request.user)

        if (!ability.can(Action.Delete, user)) {
            throw new UnauthorizedException(
                'You are not allowed to delete this user',
            )
        }

        return this.usersService.remove(id)
    }
}
