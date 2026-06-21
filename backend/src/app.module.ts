import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { PostsModule } from './posts/posts.module';
import { PrismaModule } from './prisma/prisma.module';
import { SeoModule } from './seo/seo.module';
import { TagsModule } from './tags/tags.module';
import { UploadsModule } from './uploads/uploads.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    PostsModule,
    CategoriesModule,
    SeoModule,
    TagsModule,
    UploadsModule,
  ],
})
export class AppModule {}
