import { IsEmail, IsNotEmpty, Validate } from 'class-validator'

import { Unique } from 'src/unique'
import { User } from 'src/users/entities/user.entity'

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    @Validate(Unique, [User])
    email: string

    @IsNotEmpty()
    first_name: string

    @IsNotEmpty()
    last_name: string

    @IsNotEmpty()
    password: string
}
