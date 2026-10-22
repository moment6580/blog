# Zak's Blog

个人博客，基于 Astro 构建，部署在 Vercel：<https://uuu.re>

内容以 Markdown 存放，构建后是纯静态站点；评论系统是可选的自托管 CWD（Cloudflare Worker + D1 + KV），默认关闭。

## 技术栈

| 层 | 选型 |
| --- | --- |
| 框架 | Astro 7（`output: "static"`） |
| 交互 | React 19 islands + Tailwind CSS 4 |
| 代码块 | Expressive Code |
| 数学公式 | remark-math + KaTeX |
| 搜索 | Pagefind（构建时索引） |
| 页面切换 | Swup |
| 部署 | Vercel |
| 评论 | 自托管 CWD（可选） |

包管理器是 **pnpm**。

## 本地开发

```bash
pnpm install
pnpm dev
```

| 命令 | 作用 |
| --- | --- |
| `pnpm dev` | 本地开发服务器，默认 `http://localhost:4321` |
| `pnpm build` | 构建到 `dist/`，并生成 Pagefind 搜索索引 |
| `pnpm preview` | 预览构建产物 |
| `pnpm check` | Astro 类型与内容校验 |

## 写作

正式文章放在 `src/content/posts/`，支持子目录。frontmatter 示例：

```yaml
---
title: 文章标题
published: 2026-08-17
updated: 2026-08-18        # 可选
description: 摘要          # 可选
image: /images/cover.webp  # 可选
tags: [Astro, 前端]
category: TechnicalTutorials
pinned: false
draft: false
---
```

- `draft: true` 的文章只在 `pnpm dev` 可见，`pnpm build` 不会构建。
- 文件名（或目录下的 `index.md`）决定文章 URL。
- 图片放 `public/images/`，frontmatter 或正文里用 `/images/...` 引用。

`src/content/thoughts/` 和 `src/content/studies/` 分别是碎碎念和学习追踪，按需使用；没有 `draft` 字段，写了就会构建。

## 项目结构

```text
src/
├── pages/          路由
├── layouts/        页面骨架
├── components/     Astro / React 组件
├── content/        Markdown 内容
├── data/           个人信息、友链
├── styles/         全局样式
├── plugins/        remark / rehype / Expressive Code 插件
public/             静态资源与 JSON 数据
cwd-api/            评论后端（独立 Cloudflare Worker）
scripts/            内容同步脚本（可选）
```

## 部署

Vercel 导入本仓库即可，Framework Preset 选 **Astro**，Node 22，构建命令使用仓库里的 `vercel.json`：

- Build：`pnpm build`
- Install：`pnpm install --frozen-lockfile`
- Output：`dist`

需要在 Vercel 配置的环境变量：

| 变量 | 说明 |
| --- | --- |
| `PUBLIC_CWD_API_BASE_URL` | 评论 API 地址。**留空则整个评论区不渲染** |
| `PUBLIC_CWD_CUSTOM_CSS_URL` | 可选，评论区自定义样式 |

域名在 Vercel 的 **Settings → Domains** 绑定；DNS 生效后 Vercel 会自动签发证书。

## 评论

默认关闭。要启用自托管 CWD，按 [`cwd-api/README.md`](cwd-api/README.md) 部署后端，然后把 Worker 地址填到 `PUBLIC_CWD_API_BASE_URL`。

## 可选模块

- 书架数据：`public/data/books.json`、`papers.json`、`comics.json`
- 友链：`src/data/friends.json`
- 内容同步：`.github/workflows/` 下的 `sync-content`、`sync-flomo`、`update-books-data` 需要腾讯云 COS / 飞书 secrets；不用就禁用
- 评论后端：`cwd-api/`

## 致谢

文章系统参考 [Fuwari](https://github.com/saicaca/fuwari)，站点源码来自 [VermilionVoid](https://github.com/Lapis0x0/VermilionVoid)。代码可自由参考；文章内容版权归各自作者所有。
