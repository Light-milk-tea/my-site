import { Injectable } from '@nestjs/common';
import { toSlug } from '../common/slug';
import { PrismaService } from '../prisma/prisma.service';
import { UpsertCategoryDto } from './dto/upsert-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { posts: true } } },
    });
  }

  create(dto: UpsertCategoryDto) {
    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug: dto.slug?.trim() || toSlug(dto.name),
        description: dto.description,
      },
    });
  }

  update(id: string, dto: UpsertCategoryDto) {
    return this.prisma.category.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.slug?.trim() || toSlug(dto.name),
        description: dto.description,
      },
    });
  }

  remove(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}
