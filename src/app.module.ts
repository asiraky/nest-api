import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'

import { UsersModule } from './users/users.module'
import { Unique } from './unique'
import { AuthModule } from './auth/auth.module'
import { AuthController } from './auth/auth.controller'
import { CaslModule } from './casl/casl.module'

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
        CaslModule,
    ],
    providers: [Unique],
    controllers: [AuthController],
})
export class AppModule {}
