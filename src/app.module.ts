import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UsersModule } from 'src/users/users.module'
import { Unique } from 'src/unique'
import { AuthModule } from 'src/auth/auth.module'
import { AuthController } from 'src/auth/auth.controller'

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: 'localhost',
            port: 33060,
            username: 'root',
            password: 'secret',
            database: 'nest_api',
            autoLoadEntities: true,
            synchronize: true,
        }),
        UsersModule,
        AuthModule,
    ],
    providers: [Unique],
    controllers: [AuthController],
})
export class AppModule {}
