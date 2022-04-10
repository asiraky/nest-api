import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UsersService } from './users.service'
import { UsersController } from './users.controller'
import { User } from '../users/entities/user.entity'
import { CaslModule } from '../casl/casl.module'

@Module({
    imports: [TypeOrmModule.forFeature([User]), CaslModule],
    exports: [UsersService],
    controllers: [UsersController],
    providers: [UsersService],
})
export class UsersModule {}
