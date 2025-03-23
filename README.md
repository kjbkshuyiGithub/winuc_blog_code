# 团队博客系统

一个现代化、美观、高性能的团队博客系统，专为中国大陆地区优化，具备完善的后台管理和安全防护功能。

## 技术栈

- **前端框架**: Next.js 14 (React)
- **样式**: TailwindCSS + Framer Motion (动画效果)
- **状态管理**: React Hooks
- **数据获取**: Next.js API Routes
- **数据库**: PostgreSQL + Prisma ORM
- **认证**: NextAuth.js
- **部署**: Vercel/阿里云/腾讯云
- **安全措施**: reCAPTCHA v3, Rate Limiting, CSRF保护

## 特性

- ✨ 现代化UI设计，美观的动画效果
- 🚀 高性能，针对中国大陆地区网络优化
- 🌙 深色模式支持
- 📱 完全响应式，适配各种设备
- 🔒 完善的安全防护措施
- 📝 Markdown/MDX支持的博客系统
- 👥 团队成员展示
- 🔍 全文搜索功能
- 📊 访问统计和分析
- 🔄 SEO优化

## 快速开始

### 前提条件

- Node.js 18+
- npm 或 yarn
- PostgreSQL数据库

### 安装

1. 克隆仓库

```bash
git clone https://github.com/kjbkshuyigithub/winuc_blog_code.git
cd winuc_blog_code
```

2. 安装依赖

```bash
npm install
# 或
yarn install
```

3. 配置环境变量

复制`.env.example`文件为`.env`，并填写相应的配置信息：

```bash
cp .env.example .env
```

4. 初始化数据库

```bash
npx prisma migrate dev
```

5. 启动开发服务器

```bash
npm run dev
# 或
yarn dev
```

访问 `http://localhost:3000` 查看博客。

## 部署

### Vercel部署

1. 在Vercel上导入项目
2. 配置环境变量
3. 部署

### 自托管部署

1. 构建项目

```bash
npm run build
# 或
yarn build
```

2. 启动服务

```bash
npm run start
# 或
yarn start
```

## 安全配置

本项目包含多层安全防护：

- HTTP安全头部
- CSRF保护
- 速率限制
- 人机验证
- 输入验证和净化
- 安全的认证系统

## 后台管理

访问 `/admin` 路径进入后台管理系统，可以：

- 管理文章和分类
- 管理用户和权限
- 查看访问统计
- 配置网站设置

## 贡献指南

欢迎贡献代码、报告问题或提出新功能建议。请遵循以下步骤：

1. Fork项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 创建Pull Request

## 许可证

Apache License 2.0

## ⚠️ 目前项目并没有完成，有大BUG，请不要使用！