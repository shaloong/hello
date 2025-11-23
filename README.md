# Shaloong Hello 企业门户

> Shaloong 工作入口与信息枢纽。

## 快速开始

```bash
pnpm install       # 建议使用 Node 18.18+
pnpm dev           # 本地开发
pnpm build         # 打包构建
pnpm preview       # 预览生产包
pnpm lint          # 代码质量检查
```

## 目录结构

```
.
├─ src
│  ├─ assets        # 全局样式与静态资源
│  ├─ components    # UI 组件（布局 / 导航 / 小部件）
│  ├─ composables   # 通用组合式工具
│  ├─ router        # 路由注册
│  ├─ services      # 外部 API 集成层
│  ├─ stores        # Pinia 状态管理
│  ├─ types         # TypeScript 类型定义
│  └─ views         # 页面级视图
```

## 技术栈

- Vue 3 + `<script setup>` + TypeScript
- Vite 构建、代码分割与懒加载
- Vue Router / Pinia / Day.js
- ESLint + Prettier + Strict TS

## 核心能力

- 分类网格导航、搜索过滤、应用收藏
- 主题切换、收藏筛选等个性化体验
- 天气、日历等信息小部件
- `useAsyncData` 内存缓存，降低外部 API 压力

## 环境变量

复制 `.env.example` 为 `.env.local` 并填充：

- `VITE_WEATHER_BASE_URL`：天气数据源（默认 Open-Meteo）

## 后续规划

- 接入真实单点登录与组织权限
- 完善飞书 OAuth 授权流程
- 增强移动端交互、自定义布局持久化
