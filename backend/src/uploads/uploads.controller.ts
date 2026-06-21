import {
  BadRequestException,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

const allowedImageTypes = new Map([
  ['image/jpeg', '.jpg'],
  ['image/png', '.png'],
  ['image/gif', '.gif'],
  ['image/webp', '.webp'],
]);

@Controller('uploads')
export class UploadsController {
  @UseGuards(JwtAuthGuard)
  @Post('images')
  @UseInterceptors(
    FileInterceptor('file', {
      limits: { fileSize: 5 * 1024 * 1024 },
      fileFilter: (_request, file, callback) => {
        callback(null, allowedImageTypes.has(file.mimetype));
      },
    }),
  )
  async uploadImage(@UploadedFile() file: { buffer: Buffer; mimetype: string } | undefined) {
    if (!file) {
      throw new BadRequestException('请上传 jpg、png、gif 或 webp 图片，大小不超过 5MB');
    }

    const extension = allowedImageTypes.get(file.mimetype);
    if (!extension) {
      throw new BadRequestException('不支持的图片格式');
    }

    const uploadDir = join(process.cwd(), 'uploads', 'images');
    const filename = `${Date.now()}-${randomUUID()}${extension}`;
    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, filename), file.buffer);

    return {
      filename,
      url: `/uploads/images/${filename}`,
    };
  }
}
