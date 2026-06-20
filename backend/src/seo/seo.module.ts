import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '../prisma/prisma.module';
import { SeoController } from './seo.controller';

@Module({
  imports: [ConfigModule, PrismaModule],
  controllers: [SeoController],
})
export class SeoModule {}
