import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findAll(companyId: string): Promise<{ id: string; name: string }[]> {
    return await this.userRepository.find({
      where: { company: { id: companyId } },
      select: ['id', 'name'],
      order: { name: 'ASC' },
    });
  }
}
