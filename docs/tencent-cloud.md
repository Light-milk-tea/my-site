# 腾讯云上线 Runbook

本文档用于把当前博客部署到腾讯云中国大陆服务器。正式域名访问前需要完成 ICP 备案，备案期间可先使用服务器公网 IP 验证部署。

## 1. 购买服务器

推荐配置：

- 产品：CVM 云服务器
- 地域：优先选择目标访客所在地附近，例如广州、上海、北京
- 规格：2核2G
- 系统盘：50GB 起步
- 操作系统：Ubuntu Server 22.04 LTS 或 24.04 LTS
- 带宽：3Mbps 到 5Mbps
- 登录方式：SSH 密钥优先，密码登录也可

## 2. 配置安全组

入站规则只开放：

| 端口 | 协议 | 来源 | 用途 |
| --- | --- | --- | --- |
| 22 | TCP | 你的公网 IP | SSH 登录 |
| 80 | TCP | 0.0.0.0/0 | HTTP 与证书签发 |
| 443 | TCP | 0.0.0.0/0 | HTTPS |

不要开放：

- `3000`：NestJS 后端只允许 Nginx 内部访问。
- `5432`：PostgreSQL 只允许 Docker 内部网络访问。

## 3. 域名与备案

1. 在腾讯云购买域名，或把已有域名转入腾讯云解析。
2. 完成腾讯云账号实名认证。
3. 在腾讯云备案系统提交 ICP 备案。
4. 备案期间先不要强依赖域名访问，可先用服务器公网 IP 部署验证。
5. 备案通过后，在 DNS 解析添加：

| 主机记录 | 类型 | 记录值 |
| --- | --- | --- |
| @ | A | 服务器公网 IP |
| www | A | 服务器公网 IP |

## 4. 初始化服务器

登录服务器：

```bash
ssh ubuntu@服务器公网IP
```

安装运行环境：

```bash
sudo bash deploy/scripts/setup-ubuntu.sh
```

脚本会安装 Docker、Docker Compose、Git，并启用 `22`、`80`、`443` 防火墙规则。

## 5. 上传代码

推荐用 Git：

```bash
sudo mkdir -p /opt/my-site
sudo chown -R "$USER":"$USER" /opt/my-site
git clone <你的仓库地址> /opt/my-site
cd /opt/my-site
```

如果暂时没有远程仓库，也可以用 `scp` 或腾讯云控制台文件上传，把项目放到 `/opt/my-site`。

## 6. 配置生产环境变量

```bash
cd /opt/my-site
cp .env.example .env
nano .env
```

必须修改：

- `POSTGRES_PASSWORD`：数据库强密码。
- `JWT_SECRET`：足够长的随机字符串。
- `ADMIN_EMAIL`：后台管理员邮箱。
- `ADMIN_PASSWORD`：后台管理员强密码。
- `FRONTEND_ORIGIN`：IP 阶段可先填 `http://服务器公网IP`，域名 HTTPS 后改成 `https://example.com`。
- `DOMAIN_NAME`：备案通过后的主域名。
- `CERTBOT_EMAIL`：证书续期通知邮箱。

生成随机 `JWT_SECRET`：

```bash
openssl rand -hex 32
```

## 7. IP 阶段部署验证

```bash
bash deploy/scripts/deploy.sh
```

检查服务：

```bash
docker compose ps
docker compose logs -f backend
bash deploy/scripts/health-check.sh http://服务器公网IP
```

访问：

- `http://服务器公网IP/`
- `http://服务器公网IP/admin`
- `http://服务器公网IP/api/categories`

后台首次登录使用 `.env` 中的 `ADMIN_EMAIL` 和 `ADMIN_PASSWORD`。

## 8. 域名 HTTPS

备案通过且 DNS 生效后执行：

```bash
bash deploy/scripts/issue-cert.sh example.com admin@example.com www.example.com
```

然后更新 `.env`：

```bash
FRONTEND_ORIGIN=https://example.com
DOMAIN_NAME=example.com
```

重启服务：

```bash
bash deploy/scripts/deploy.sh
```

## 9. 备份与续期

手动备份数据库：

```bash
bash deploy/scripts/backup-postgres.sh
```

手动健康检查：

```bash
bash deploy/scripts/health-check.sh https://example.com
```

添加每日备份：

```bash
crontab -e
```

写入：

```cron
0 3 * * * cd /opt/my-site && bash deploy/scripts/backup-postgres.sh >> deploy/backups/backup.log 2>&1
```

添加每周证书续期检查：

```cron
15 4 * * 1 cd /opt/my-site && bash deploy/scripts/renew-cert.sh >> deploy/certbot/renew.log 2>&1
```

## 10. 常见问题

- 打不开网站：先检查安全组是否开放 `80`，再执行 `docker compose ps`。
- 后台无法登录：检查 `backend` 日志，确认管理员已按 `.env` 自动创建。
- HTTPS 签发失败：确认域名已解析到服务器公网 IP，且 `80` 端口可访问。
- 文章发布后前台没有显示：确认文章状态是 `PUBLISHED`，并检查浏览器网络请求是否返回 200。
