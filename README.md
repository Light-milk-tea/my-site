# 我的独立博客

这是一个 Vue3 + NestJS + PostgreSQL 的个人独立博客项目，包含公开博客站点、后台管理、REST API 和 Docker Compose 部署配置。

## 技术栈

- 前端：Vue3、Vite、TypeScript、Vue Router、Pinia、Element Plus
- 后端：NestJS、Prisma、JWT、PostgreSQL
- 部署：Docker Compose、Nginx

## 本地开发

```bash
# 前端
cd frontend
npm install
npm run dev

# 后端
cd backend
npm install
copy .env.example .env
npx prisma generate
npm run start:dev
```

后端需要可用的 PostgreSQL，并在 `backend/.env` 中配置 `DATABASE_URL`。

## 生产部署

```bash
cp .env.example .env
bash deploy/scripts/deploy.sh
```

首次启动时，后端会自动执行 Prisma 迁移，并根据 `.env` 中的 `ADMIN_EMAIL`、`ADMIN_PASSWORD` 创建默认管理员。

部署文档：

- 通用服务器部署：`docs/deploy.md`
- 腾讯云上线 Runbook：`docs/tencent-cloud.md`

## 常用地址

- 公开博客：`http://localhost/`
- 后台管理：`http://localhost/admin`
- API 前缀：`http://localhost/api`
