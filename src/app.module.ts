import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UsersModule } from './users/users.module'
import { Unique } from './unique'

@Module({
    imports: [
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
    ],
    providers: [Unique],
})
export class AppModule {}
