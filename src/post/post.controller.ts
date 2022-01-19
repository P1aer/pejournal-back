import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  NotFoundException, Query, UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { SearchPostDto } from './dto/search-post.dto';
import {JwtAuthGuard} from "../auth/quards/jwt-auth.guard";
import {UserEntity} from "../user/entities/user.entity";
import {User} from "../decorators/user.decorator";

@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  create(@User() userId: number, @Body() dto: CreatePostDto) {
    return this.postService.create(dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(@User() userId: number, @Param('id') id: string, @Body() dto: UpdatePostDto) {
    return this.postService.update(+id, dto, userId);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@User() userId: number, @Param('id') id: string) {
    return this.postService.remove(+id, userId);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get('/popular')
  getPopular() {
    return this.postService.popular();
  }

  @Get('/search')
  searchPosts(@Query() dto: SearchPostDto) {
    return this.postService.search(dto);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }


}
