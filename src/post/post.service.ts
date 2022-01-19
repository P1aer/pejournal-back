import {ForbiddenException, Injectable, NotFoundException} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostEntity as Post } from './entities/post.entity';
import { SearchPostDto } from './dto/search-post.dto';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post)
    private repository: Repository<Post>,
  ) {}

  create(dto: CreatePostDto, userId:number) {
    const description = dto.body.find((obj) => obj.type === 'paragraph')
        ?.data?.text;
    return this.repository.save({
      title: dto.title,
      body: dto.body,
      tags: dto.tags,
      description: description || '',
      user: {
        id: userId
      }
    });
  }

  findAll() {
    return this.repository.find({
      order: {
        created: 'DESC',
      },
    });
  }
  async search(dto: SearchPostDto) {
    const qb = this.repository.createQueryBuilder('s');
    qb.limit(dto.limit || 0);
    qb.take(dto.take || 10);
    if (dto.views) {
      qb.orderBy('views', dto.views);
    }
    if (dto.body) {
      qb.andWhere(`s.body ILIKE :body%`);
    }
    if (dto.title) {
      qb.andWhere(`s.title ILIKE :title`);
    }
    if (dto.tag) {
      qb.andWhere(`s.tag ILIKE :tag`);
    }
    qb.setParameters({
      title: `%${dto.title}%`,
      body: `%${dto.body}%`,
      tag: `%${dto.tag}%`,
    });

    const [posts, count] = await qb.getManyAndCount();
    return {
      posts,
      count,
    };
  }

  async popular() {
    const qb = this.repository.createQueryBuilder('pop');
    qb.orderBy('views', 'DESC');
    qb.limit(10);

    const [posts, count] = await qb.getManyAndCount();
    return {
      posts,
      count,
    };
  }

  async findOne(id: number) {
    await this.repository
      .createQueryBuilder('posts')
      .whereInIds(id)
      .update()
      .set({
        views: () => 'views + 1',
      })
      .execute();

    return this.repository.findOne(id);
  }

  async update(id: number, dto: UpdatePostDto, userId:number) {
    const find = await this.repository.findOne(+id);

    if (!find) {
      throw new NotFoundException('Статья не Найдена');
    }
    const description = dto.body.find((obj) => obj.type === 'paragraph')
        ?.data?.text;
    return this.repository.update(id, {
      title: dto.title,
      body: dto.body,
      tags: dto.tags,
      description: description || '',
      user: {
        id: userId
      }
    });
  }

  async remove(id: number, userId:number) {
    const find = await this.repository.findOne(+id);

    if (!find) {
      throw new NotFoundException('Статья не Найдена');
    }
    if (find.user.id != userId) {
      throw new ForbiddenException("Вы не автор статьи")
    }
    return this.repository.delete(id);
  }
}
