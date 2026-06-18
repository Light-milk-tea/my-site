import { Injectable } from '@nestjs/common';
import { toSlug } from '../common/slug';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertTagDto } from './dto/upsert-tag.dto';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.tag.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: true } } },
    });
  }

  create(dto: UpsertTagDto) {
    return this.prisma.tag.create({
      data: {
        name: dto.name,
        slug: dto.slug?.trim() || toSlug(dto.name),
      },
    });
  }

  update(id: string, dto: UpsertTagDto) {
    return this.prisma.tag.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug?.trim() || toSlug(dto.name),
      },
    });
  }

  remove(id: string) {
    return this.prisma.tag.delete({ where: { id } });
  }
}
