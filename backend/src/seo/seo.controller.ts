import { Controller, Get, Header } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PostStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

const staticPaths = ['/', '/posts', '/friends', '/about'];

@Controller()
export class SeoController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  @Get('robots.txt')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  robots() {
    const siteUrl = this.siteUrl();
    return [
      'User-agent: *',
      'Allow: /',
      'Disallow: /admin',
      'Disallow: /login',
      `Sitemap: ${siteUrl}/sitemap.xml`,
      '',
    ].join('\n');
  }

  @Get('sitemap.xml')
  @Header('Content-Type', 'application/xml; charset=utf-8')
  async sitemap() {
    const siteUrl = this.siteUrl();
    const posts = await this.publishedPosts();
    const urls = [
      ...staticPaths.map((path) => ({
        loc: `${siteUrl}${path}`,
        lastmod: new Date().toISOString(),
        priority: path === '/' ? '1.0' : '0.7',
      })),
      ...posts.map((post) => ({
        loc: `${siteUrl}/posts/${post.slug}`,
        lastmod: post.updatedAt.toISOString(),
        priority: '0.8',
      })),
    ];

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${escapeXml(url.loc)}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>`;
  }

  private publishedPosts() {
    return this.prisma.post.findMany({
      where: { status: PostStatus.PUBLISHED },
      orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
      take: 100,
    });
  }

  private siteUrl() {
    const rawUrl = this.config.get<string>('SITE_URL') ?? this.config.get<string>('FRONTEND_ORIGIN') ?? 'http://localhost';
    return rawUrl.replace(/\/$/, '');
  }
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}
