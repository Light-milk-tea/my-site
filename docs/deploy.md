# 服务器部署说明

## 1. 准备服务器

服务器需要安装：

- Docker
- Docker Compose
- Git
- 一个已经解析到服务器公网 IP 的域名，或先使用公网 IP 验证

Ubuntu 服务器可直接执行：

```bash
sudo bash deploy/scripts/setup-ubuntu.sh
```

## 2. 配置环境变量

复制根目录环境变量模板：

```bash
cp .env.example .env
```

至少修改以下值：

- `POSTGRES_PASSWORD`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `FRONTEND_ORIGIN`
- `DOMAIN_NAME`
- `CERTBOT_EMAIL`

## 3. 先用 IP 启动服务

```bash
bash deploy/scripts/deploy.sh
```

查看运行状态：

```bash
docker compose ps
docker compose logs -f backend
```

确认以下地址可访问：

- `http://服务器IP/`
- `http://服务器IP/admin`
- `http://服务器IP/api/categories`

## 4. 绑定域名

域名备案通过后：

- 在 DNS 中添加 `A` 记录到服务器公网 IP。
- 将 `.env` 中的 `FRONTEND_ORIGIN` 改成正式域名，例如 `https://example.com`。
- 将 `.env` 中的 `DOMAIN_NAME` 改成正式域名。

## 5. 签发 HTTPS 证书

当前项目的 Nginx 运行在 Docker 容器中，证书也通过 Docker Certbot 签发：

```bash
bash deploy/scripts/issue-cert.sh example.com admin@example.com www.example.com
```

证书签发成功后，脚本会把 `deploy/nginx/blog.https.conf.example` 生成到 `deploy/nginx/blog.conf`，并重载 Nginx。

续期检查：

```bash
bash deploy/scripts/renew-cert.sh
```

## 6. 日常维护

更新代码后重新构建：

```bash
bash deploy/scripts/deploy.sh
```

备份数据库：

```bash
bash deploy/scripts/backup-postgres.sh
```

建议添加到 crontab，每天凌晨备份：

```bash
0 3 * * * cd /opt/my-site && bash deploy/scripts/backup-postgres.sh >> deploy/backups/backup.log 2>&1
```
