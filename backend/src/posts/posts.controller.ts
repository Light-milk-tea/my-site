import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { JwtUser } from '../auth/jwt.strategy';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PostQueryDto } from './dto/post-query.dto';
import { UpsertPostDto } from './dto/upsert-post.dto';
import { PostsService } from './posts.service';

@Controller('posts')
export class PostsController {
  constructor(private readonly posts: PostsService) {}

  @Get()
  findPublished(@Query() query: PostQueryDto) {
    return this.posts.findPublished(query);
  }

  @Get('admin')
  @UseGuards(JwtAuthGuard)
  findAdmin(@Query() query: PostQueryDto) {
    return this.posts.findAdmin(query);
  }

  @Get('admin/:id')
  @UseGuards(JwtAuthGuard)
  findAdminById(@Param('id') id: string) {
    return this.posts.findAdminById(id);
  }

  @Get(':slug')
  findPublishedBySlug(@Param('slug') slug: string) {
    return this.posts.findPublishedBySlug(slug);
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() dto: UpsertPostDto, @Request() req: { user: JwtUser }) {
    return this.posts.create(dto, req.user.userId);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() dto: UpsertPostDto) {
    return this.posts.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string) {
    return this.posts.remove(id);
  }
}
