import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';
import bcrypt from 'bcrypt';
import { promisify } from 'util';

import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

const hashAsync = promisify(bcrypt.hash);
const compareAsync = promisify(bcrypt.compare);

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const userId = nanoid(12);
    const result = await hashAsync(createUserDto.password, 8);
    const user = this.usersRepository.create({
      id: userId,
      ...createUserDto,
      password: result,
    });
    return this.usersRepository.save(user);
  }

  findAll() {
    return this.usersRepository.find();
  }

  findOne(userId: string) {
    return this.usersRepository.findOne(userId);
  }

  async update(userId: string, updateUserDto: UpdateUserDto) {
    const user = await this.usersRepository.findOne(userId);
    if (!user) {
      throw new NotFoundException();
    }
    return this.usersRepository.save({
      ...user,
      ...updateUserDto,
    });
  }

  async remove(userId: string) {
    const result = await this.usersRepository.delete(userId);
    if (result.affected === 0) {
      throw new NotFoundException();
    }
    if (result.affected > 1) {
      throw new InternalServerErrorException();
    }
  }

  async validatePassword(userId: string, password: string) {
    const user = await this.findOne(userId);
    if (!user) {
      throw new NotFoundException();
    }
    return compareAsync(password, user.password);
  }
}