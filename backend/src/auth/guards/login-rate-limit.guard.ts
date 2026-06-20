import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import type { Request } from 'express';

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, number[]>();

@Injectable()
export class LoginRateLimitGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>();
    const key = this.keyFor(request);
    const now = Date.now();
    const recentAttempts = (attempts.get(key) ?? []).filter((timestamp) => now - timestamp < WINDOW_MS);

    if (recentAttempts.length >= MAX_ATTEMPTS) {
      throw new HttpException('登录尝试过于频繁，请稍后再试', HttpStatus.TOO_MANY_REQUESTS);
    }

    recentAttempts.push(now);
    attempts.set(key, recentAttempts);
    return true;
  }

  private keyFor(request: Request) {
    const forwardedFor = request.headers['x-forwarded-for'];
    const ip = Array.isArray(forwardedFor) ? forwardedFor[0] : forwardedFor?.split(',')[0] || request.ip || 'unknown';
    const email = typeof request.body?.email === 'string' ? request.body.email.toLowerCase() : 'unknown';
    return `${ip}:${email}`;
  }
}
