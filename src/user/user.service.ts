import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity as User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { SearchUserDto } from './dto/search-user.dto';
import {CommentEntity} from "../comment/entities/comment.entity";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private repository: Repository<User>,
  ) {}

  create(dto: CreateUserDto) {
    return this.repository.save(dto);
  }

 async findAll() {
    const arr = await this.repository
        .createQueryBuilder('u')
        .leftJoinAndMapMany(
            'u.comments',
            CommentEntity,
            'comment',
            'comment.userId = u.id',
        )
        .loadRelationCountAndMap('u.commentsCount', 'u.comments', 'comments')
        .getMany();

    return arr.map((obj) => {
      delete obj.comments;
      return obj;
    });

  }

  findById(id: number) {
    return this.repository.findOne(id);
  }

  findByCond(cond: LoginUserDto) {
    return this.repository.findOne(cond);
  }

  update(id: number, dto: UpdateUserDto) {
    return this.repository.update(id, dto);
  }

  async search(dto: SearchUserDto) {
    const qb = this.repository.createQueryBuilder('u');

    qb.limit(dto.limit || 0);
    qb.take(dto.take || 10);

    if (dto.name) {
      qb.andWhere(`u.fullName ILIKE :fullName`);
    }

    if (dto.email) {
      qb.andWhere(`u.email ILIKE :email`);
    }

    qb.setParameters({
      email: `%${dto.email}%`,
      fullName: `%${dto.name}%`,
    });

    const [items, total] = await qb.getManyAndCount();

    return { items, total };
  }

}
