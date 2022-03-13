import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { Unique } from './unique';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'secret',
      database: 'nest',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UsersModule,
  ],
  providers: [Unique],
})
export class AppModule {}
