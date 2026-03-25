# 参与通 Deal Connect (L2)

参与通是一个围绕投资机会筛选、意向处理、条款协作与谈判留痕的演示型全栈应用。  
技术上采用 `Hono + Vite + Cloudflare Pages/Workers`，前端为 `Tailwind + 原生 JS` 的模块化拆分。

## 1. 业务目标与核心流程

业务流转如下：

```text
发起通 (Originate) -> 评估通 (Assess, AI 筛子) -> 参与通 (Deal Connect) -> 条款通/合约通
```

在本项目（参与通）中，主要覆盖：

- 机会看板浏览（项目视图/品牌视图）
- 投资者与融资方双视角切换
- 营业额预估工作台（模型/融资方/自行填写三来源）
- 条款工作台（公共条款 + 私有预测 + 派生指标）
- 意向表达与融资方意向处理（多请求队列、锁定规则）
- 谈判协作（多方案、反提案、纪要、邀请、合约输出快照）
- 时间线审计与历史参数回填

## 2. 功能概览

### 2.1 看板层

- 登录、注册、游客模式
- 演示数据加载（按品牌生成多项目）
- 多维筛选与排序：行业、状态、关键词、时间/金额/评分排序
- 统计卡：全部机会 / 筛后通过 / 已表达意向 / 已确认参与
- 品牌视图点击后自动切换到项目视图并带入品牌关键词
- 搜索框一键清空按钮

### 2.2 评估通筛子能力

- 筛子库内置 10 个模型：行业偏好、风控优先、高回报、区域聚焦、综合评估、高成长、大额项目、团队实力、短周期、稳健保守
- 支持筛子管理弹窗：添加/移除个人面板筛子
- `全部机会` 为内置固定项，不可移除

### 2.3 双视角切换

- 视角：`investor`（投资者）/ `financer`（融资方）
- 融资方视角主要变化：
- 隐藏评估通筛子相关区域
- 看板列表标题切换为 `融资项目`
- 列表仅展示前 2 个项目（演示约束）
- 意向 Tab 文案切为 `意向处理`
- 主题色切为琥珀系

### 2.4 项目会话页（6 个 Tab）

- `做功课`：项目一页纸、同行参考、筛子辅助评估
- `营业额预估`：走势对比图（历史实际 + 三类预测），并可将选中值写回工作台
- `条款工作台`：三区模型与公式联动，支持提交方案草稿
- `意向处理`：结构化意向提交、融资方处理、多请求锁定/释放
- `谈判`：多方案对比、接受/拒绝/反提案、纪要、邀请、合约输出预览
- `时间线`：记录关键事件，支持按事件快照回填条款参数

## 3. 技术架构

### 3.1 后端（Hono）

- 入口：`src/index.tsx`
- 路由挂载：
- `/api/auth` -> `src/routes/auth.ts`
- `/api/deals` -> `src/routes/deals.ts`
- 页面路由与 favicon -> `src/routes/pages.ts`

当前后端为演示态：

- 鉴权数据在内存 `Map` 中
- `GET /api/deals` 返回空数组（机会数据由前端演示数据构造并缓存）

### 3.2 前端（模块化原生 JS）

脚本按顺序加载（见 `src/pages/main-html.ts`）：

1. `state.js`：全局状态、筛子定义、可比参考数据
2. `shared.js`：通用能力（toast、视角切换、Tab 切换、解析函数）
3. `intent.js`：意向提交与处理逻辑
4. `negotiation.js`：谈判、时间线、合约输出逻辑
5. `forecast.js`：营业额预估工作台与图表
6. `workbench.js`：条款工作台计算与提案提交
7. `auth.js`：登录注册与演示数据生成
8. `sieves.js`：筛子管理与筛选应用
9. `dashboard.js`：看板渲染、搜索/过滤/排序、卡片交互
10. `project-session.js`：项目详情与会话页入口
11. `ui.js`：弹窗、引导、辅助 UI
12. `app-init.js`：应用启动、localStorage 恢复

## 4. 数据与持久化

当前项目为前端本地持久化 + 后端演示态内存存储。  
主要 localStorage key：

- `ec_allDeals`：项目主列表
- `ec_mySieves`：个人筛子面板
- `ec_perspective`：当前视角
- `ec_researchInputsByDeal`：做功课/预估输入
- `ec_forecastByDeal`：营业额预估工作台状态
- `ec_workbenchByDeal`：条款工作台状态
- `ec_intentByDeal`：意向请求与处理状态
- `ec_negotiationByDeal`：提案、纪要、邀请
- `ec_timelineByDeal`：时间线事件
- `ec_contractPayloadByDeal`：流向合约通的公共参数快照
- `ec_onboarded`：新手引导是否已完成

如需重置演示环境，可清理以上 key 或直接清空站点 localStorage。

## 5. 本地开发

## 5.1 环境要求

- Node.js >= 18
- npm >= 9

## 5.2 快速启动

```bash
npm install
npm run hooks:install
npm run dev
```

默认会启动 Vite 开发服务（端口由 Vite 分配，通常为 `5173`）。

如需按 Cloudflare Pages 方式本地预览：

```bash
npm run build
npm run preview
```

## 5.3 常用脚本

```bash
npm run dev            # Vite 开发
npm run build          # 构建 dist
npm run preview        # Wrangler Pages 本地预览
npm run lint           # 静态 JS 语法检查
npm run typecheck      # TypeScript 检查
npm run check          # lint + typecheck + build
npm run deploy         # build + wrangler pages deploy
npm run hooks:install  # 安装本地 git hook
```

## 5.4 提交前质量门禁

- `.githooks/pre-commit` 会自动执行 `npm run check`
- `scripts/check-static-js.mjs` 会对 `public/static/js/**/*.js` 逐文件执行 `node --check`

## 6. 部署（Cloudflare Pages）

`wrangler.jsonc` 已配置：

- `pages_build_output_dir: ./dist`
- `compatibility_date: 2026-02-25`
- `nodejs_compat` flag

部署步骤示例：

```bash
npm install
npm run build
npx wrangler login
npx wrangler pages project create <your-project-name> --production-branch main
npx wrangler pages deploy dist --project-name <your-project-name>
```

或直接使用：

```bash
npm run deploy
```

说明：`npm run deploy` 是否需要额外参数，取决于你本地 Wrangler 的项目绑定状态。

## 7. API 一览

| Method | Path | 说明 |
|---|---|---|
| `POST` | `/api/auth/register` | 注册 |
| `POST` | `/api/auth/login` | 登录 |
| `POST` | `/api/auth/logout` | 退出 |
| `GET` | `/api/auth/me` | 当前用户（演示态返回 `null`） |
| `GET` | `/api/deals` | 机会列表（演示态空数组） |
| `GET` | `/` | 主页面 |
| `GET` | `/favicon.svg` | 站点图标 |

## 8. 目录结构

```text
.
├── src
│   ├── index.tsx
│   ├── pages
│   │   └── main-html.ts
│   └── routes
│       ├── auth.ts
│       ├── deals.ts
│       └── pages.ts
├── public
│   └── static
│       ├── base.css
│       ├── style.css
│       └── js
│           ├── app-init.js
│           ├── auth.js
│           ├── dashboard.js
│           ├── forecast.js
│           ├── intent.js
│           ├── negotiation.js
│           ├── project-session.js
│           ├── shared.js
│           ├── sieves.js
│           ├── state.js
│           ├── ui.js
│           └── workbench.js
├── scripts
│   └── check-static-js.mjs
├── .githooks
│   └── pre-commit
├── ecosystem.config.cjs
├── package.json
├── tsconfig.json
├── vite.config.ts
├── wrangler.jsonc
└── README.md
```

## 9. 协作建议

- 每次改动后先执行 `npm run check` 再提交
- 功能改动优先保持模块边界清晰（看板、会话、意向、谈判、预估、工作台）
- 涉及状态结构变更时，注意兼容旧 localStorage（项目中已有多处迁移逻辑示例）
- 合并外部分支后，优先回归以下路径：
- 视角切换 -> 看板过滤/搜索 -> 项目会话 6 Tab -> 意向处理 -> 谈判 -> 时间线

## 10. 已知边界（演示态）

- 后端鉴权与用户信息为内存态，不适用于生产
- 项目数据主要来自前端 mock 生成，不依赖真实后端数据源
- 未接入真实数据库（如 D1）与权限系统
- 未接入真实合约通，仅输出公共参数快照预览

---

如需下一步产品化，建议优先补齐：真实身份体系、D1 持久化、服务端会话/权限校验、审计日志后端化。
