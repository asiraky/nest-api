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
} from '@nestjs/common'

import { UsersService } from './users.service'
import { CreateUserDto } from 'src/users/dto/create-user.dto'
import { UpdateUserDto } from 'src/users/dto/update-user.dto'

@Controller('users')
@UseInterceptors(ClassSerializerInterceptor)
export class UsersController {
    constructor(private readonly usersService: UsersService) {}

    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto)
    }

    @Get()
    findAll() {
        return this.usersService.findAll()
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const result = await this.usersService.findOne(id)
        if (!result) {
            throw new NotFoundException()
        }
        return result
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.usersService.remove(id)
    }
}
