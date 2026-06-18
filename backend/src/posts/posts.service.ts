import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma, PostStatus } from '@prisma/client';
import { toSlug } from '../common/slug';
import { PrismaService } from '../prisma/prisma.service';
import { PostQueryDto } from './dto/post-query.dto';
import { UpsertPostDto } from './dto/upsert-post.dto';

const postInclude = {
  author: { select: { id: true, name: true, email: true } },
  category: true,
  tags: true,
} satisfies Prisma.PostInclude;

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async findPublished(query: PostQueryDto) {
    const where: Prisma.PostWhereInput = {
      status: PostStatus.PUBLISHED,
      ...(query.category ? { category: { slug: query.category } } : {}),
      ...(query.tag ? { tags: { some: { slug: query.tag } } } : {}),
      ...(query.keyword
        ? {
            OR: [
              { title: { contains: query.keyword, mode: 'insensitive' } },
              { summary: { contains: query.keyword, mode: 'insensitive' } },
              { content: { contains: query.keyword, mode: 'insensitive' } },
            ],
          }
        : {}),
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.post.findMany({
        where,
        include: postInclude,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        skip: (query.page - 1) * query.pageSize,
        take: query.pageSize,
      }),
      this.prisma.post.count({ where }),
    ]);

    return { items, total, page: query.page, pageSize: query.pageSize };
  }

  findAdmin(query: PostQueryDto) {
    return this.prisma.post.findMany({
      include: postInclude,
      orderBy: { updatedAt: 'desc' },
      skip: (query.page - 1) * query.pageSize,
      take: query.pageSize,
    });
  }

  async findPublishedBySlug(slug: string) {
    const post = await this.prisma.post.findFirst({
      where: { slug, status: PostStatus.PUBLISHED },
      include: postInclude,
    });
    if (!post) {
      throw new NotFoundException('文章不存在');
    }
    return post;
  }

  async findAdminById(id: string) {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: postInclude,
    });
    if (!post) {
      throw new NotFoundException('文章不存在');
    }
    return post;
  }

  create(dto: UpsertPostDto, authorId: string) {
    const status = dto.status ?? PostStatus.DRAFT;
    return this.prisma.post.create({
      data: {
        ...this.toPostBaseData(dto),
        status,
        publishedAt: this.resolvePublishedAt(status, dto.publishedAt),
        author: { connect: { id: authorId } },
        ...(dto.categoryId
          ? { category: { connect: { id: dto.categoryId } } }
          : {}),
        tags: { connect: dto.tagIds?.map((id) => ({ id })) ?? [] },
      },
      include: postInclude,
    });
  }

  update(id: string, dto: UpsertPostDto) {
    const status = dto.status ?? PostStatus.DRAFT;
    return this.prisma.post.update({
      where: { id },
      data: {
        ...this.toPostBaseData(dto),
        status,
        publishedAt: this.resolvePublishedAt(status, dto.publishedAt),
        category: dto.categoryId
          ? { connect: { id: dto.categoryId } }
          : { disconnect: true },
        tags: { set: dto.tagIds?.map((tagId) => ({ id: tagId })) ?? [] },
      },
      include: postInclude,
    });
  }

  remove(id: string) {
    return this.prisma.post.delete({ where: { id } });
  }

  private toPostBaseData(dto: UpsertPostDto) {
    return {
      title: dto.title,
      slug: dto.slug?.trim() || toSlug(dto.title),
      summary: dto.summary,
      cover: dto.cover,
      content: dto.content,
      seoTitle: dto.seoTitle,
    };
  }

  private resolvePublishedAt(status: PostStatus, publishedAt?: string) {
    if (status !== PostStatus.PUBLISHED) {
      return null;
    }
    return publishedAt ? new Date(publishedAt) : new Date();
  }
}
