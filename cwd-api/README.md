# CWD 评论后端

自托管的 CWD 评论系统，跑在 Cloudflare Workers 上，数据存在 D1，登录会话存在 KV。前端在 `src/components/Comments.astro`，只有配置了 `PUBLIC_CWD_API_BASE_URL` 才会渲染。

## 前置条件

- Cloudflare 账号（免费计划即可）
- Node.js 22+、pnpm
- 一个能登录的邮箱（可选，用于评论通知）

`cwd-api/` 不在主站 pnpm workspace 里，安装依赖要加 `--ignore-workspace`。

## 部署步骤

### 1. 安装依赖并登录

```bash
cd cwd-api
pnpm install --ignore-workspace
npx wrangler login
```

### 2. 创建 D1 和 KV

```bash
npx wrangler d1 create cwd-db
npx wrangler kv namespace create CWD_AUTH_KV
npx wrangler kv namespace create CWD_AUTH_KV --preview
```

把三条命令输出的 ID 填进 `cwd-api/wrangler.jsonc`：

- D1 的 `database_id`
- KV 的 `id`
- KV 预览的 `preview_id`

### 3. 初始化表结构

```bash
npx wrangler d1 execute cwd-db --remote --file=schemas/comment.sql
```

`--remote` 不能省。不加它操作的是本地模拟库，线上还是空的。

### 4. 设置管理员凭据

```bash
npx wrangler secret put ADMIN_NAME
npx wrangler secret put ADMIN_PASSWORD
```

一定要用 `secret`，不要写进 `wrangler.jsonc` 的 `vars`，也不要在 Cloudflare 面板上配明文变量——`wrangler deploy` 会用配置文件覆盖明文变量，secret 不会。

### 5. 部署 Worker

```bash
npx wrangler deploy
```

部署成功会得到一个地址，例如：

```text
https://cwd-api.your-subdomain.workers.dev
```

先访问根路径，应该返回 `成功部署 CWD 评论系统 API！`。

### 6. 在 Vercel 配置评论地址

Vercel 项目 → Settings → Environment Variables：

```text
PUBLIC_CWD_API_BASE_URL=https://cwd-api.your-subdomain.workers.dev
```

保存后必须 **Redeploy** 一次。这个变量是构建时注入的，改了不重新构建不会生效。

### 7. 进后台配置

打开 CWD 管理后台 <https://cwd.zishu.me>，填你的 Worker 地址，用第 4 步设置的 `ADMIN_NAME` / `ADMIN_PASSWORD` 登录。

至少做这几件事：

- **允许调用的域名**：填 `uuu.re,www.uuu.re`（带 www 和不带都填，逗号分隔）
- **新评论先审后发**：建议开启
- 可选：IP / 邮箱黑名单、管理员评论密钥
- 可选：邮箱提醒里配置 SMTP

不要把 `localhost` 或 `127.0.0.1` 加进白名单；那是本地开发地址，加进去等于允许任何人往你的库里写。

## 可选：绑定 comments.uuu.re

默认用 `*.workers.dev` 就够了。想用自定义域名，需要先把 `uuu.re` 的 DNS 托管到 Cloudflare，然后在 `wrangler.jsonc` 里加：

```jsonc
"routes": [
  {
    "pattern": "comments.uuu.re/*",
    "zone_name": "uuu.re"
  }
]
```

再把 `PUBLIC_CWD_API_BASE_URL` 改成 `https://comments.uuu.re` 并重新部署。域名 DNS 不在 Cloudflare 的话，这一步会失败。

## 安全提醒

- `ADMIN_PASSWORD` 用强密码，不要和别处复用。
- SMTP 密码在 D1 里是明文存储的（要能还原原文才能登录邮件服务器），不要用重要邮箱的主密码。
- 白名单挡不住直接伪造你真实 URL 的脚本，所以「先审后发」是最后一道防线。
- 定期导出 D1 备份：

```bash
npx wrangler d1 export cwd-db --remote --output cwd-backup.sql
```

## 常见问题

**评论区不显示**
检查 Vercel 的 `PUBLIC_CWD_API_BASE_URL` 是否设置，并且是否重新部署过；浏览器控制台看 `cwd-widget` 是否加载失败。

**发评论 403**
后台的「允许调用的域名」没填对，或者填了 `localhost` 却在正式域名下测试。`post_slug` 的域名必须在白名单里。

**登录 503**
`ADMIN_PASSWORD` 没设置或部署时被覆盖了。重新执行 `npx wrangler secret put ADMIN_PASSWORD`，再 `npx wrangler deploy`。

**D1 查询是空的**
命令少了 `--remote`。
