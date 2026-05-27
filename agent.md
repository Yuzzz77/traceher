# TraceHer Agent — 项目最高宪法

> **中文名称：** 卫溯  
> **项目定位：** 女性卫生用品供应链溯源与防伪验证平台  
> **生效范围：** 本文档对所有后续代码生成、数据库设计、API 实现、前端开发、工作流扩展具有最高优先级的约束力  
> **版本：** v1.0.0  
> **最后更新：** 2026-05-26

---

## 目录

1. [项目身份](#1-项目身份)
2. [业务边界](#2-业务边界)
3. [技术栈](#3-技术栈)
4. [数据库规范](#4-数据库规范)
5. [后端架构规范](#5-后端架构规范)
6. [API 规范](#6-api-规范)
7. [前端架构规范](#7-前端架构规范)
8. [角色与权限模型](#8-角色与权限模型)
9. [核心业务模块](#9-核心业务模块)
10. [审批工作流规范](#10-审批工作流规范)
11. [附件管理规范](#11-附件管理规范)
12. [安全规范](#12-安全规范)
13. [部署与运维规范](#13-部署与运维规范)
14. [AI 助手行为准则](#14-ai-助手行为准则)
15. [AI 输出顺序规范](#15-ai-输出顺序规范)
16. [术语表](#16-术语表)

---

## 1. 项目身份

### 1.1 项目名称

- **英文：** TraceHer
- **中文：** 卫溯

### 1.2 一句话定义

> TraceHer 是一个面向女性卫生用品的独立供应链溯源平台，为消费者、品牌方和监管方提供从原料到终端的全链路可信验证能力。

### 1.3 核心价值主张

| 维度 | 说明 |
|------|------|
| **消费者** | 扫码即可获取批次溯源、检测报告摘要、安全评级 |
| **供应商 / 品牌方** | 上传原料信息、生产批次、检测数据，建立可信档案 |
| **平台运营方** | 审核供应商资质、管理溯源链路、处理异常预警 |
| **监管方** | 查询全链路数据、抽查合规性、导出审计报告 |

### 1.4 项目愿景

让女性护理产品拥有清晰、可验证、可追问的安全记录——把"看不见的安全"变成每个人都能理解的信息基础设施。

---

## 2. 业务边界

### 2.1 核心业务域

```
┌─────────────────────────────────────────────────┐
│                 TraceHer 业务域                    │
├─────────────────────────────────────────────────┤
│  原料溯源    │  生产批次    │  检测报告    │  物流追踪   │
│  ─────────  │  ─────────  │  ─────────  │  ─────────  │
│  棉花/无纺布  │  工厂/产线   │  荧光剂/微生物 │  仓储/冷链   │
│  供应商资质   │  生产日期    │  pH/甲醛     │  经销商链路  │
│  产地认证    │  质检记录    │  致敏物检测   │  终端门店    │
└─────────────────────────────────────────────────┘
         │                │                │
    ┌────▼────┐     ┌────▼────┐     ┌────▼────┐
    │ 消费者端  │     │ 供应商端  │     │ 管理端   │
    │ 扫码验证  │     │ 批次上报  │     │ 审核审批  │
    │ 安全查询  │     │ 文件上传  │     │ 数据看板  │
    │ 投诉反馈  │     │ 资质管理  │     │ 风险预警  │
    └─────────┘     └─────────┘     └─────────┘
```

### 2.2 红线（STRICTLY FORBIDDEN）

以下概念和业务域 **不得** 以任何形式出现在本项目中：

- ❌ 医疗业务逻辑（处方、诊断、治疗）
- ❌ 报销系统
- ❌ 学生管理 / 教务系统
- ❌ 保险理赔
- ❌ 医院术语（科室、病历、医嘱）
- ❌ 药品监管
- ❌ 食品溯源（本系统只做卫生用品）

### 2.3 允许的业务扩展方向

- ✅ 卫生巾 / 护垫
- ✅ 棉条
- ✅ 一次性卫生内裤
- ✅ 产妇卫生用品
- ✅ 婴儿纸尿裤（作为独立品类扩展）
- ✅ 成人护理用品（作为独立品类扩展）

### 2.4 命名约束

- 所有代码、表名、字段名、类名 **必须** 使用英文
- **严禁** 使用拼音
- **严禁** 使用无意义缩写（如 `prd_id` 代替 `product_id`）
- 业务注释可使用中文

---

## 3. 技术栈

### 3.1 总体架构

```
┌──────────────────────────────────────┐
│           前端（WeChat Mini Program）   │
│      Uni-app / 原生小程序              │
│      ───────────────────────          │
│      扫码 · 查询 · 上传 · 个人中心      │
└──────────────────┬───────────────────┘
                   │ HTTPS / RESTful JSON
┌──────────────────▼───────────────────┐
│          API 网关层（可选 Nginx / Kong） │
│      鉴权 · 限流 · 日志 · 路由          │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│          Java + Spring Boot           │
│      ───────────────────────          │
│      Controller → Service → Mapper    │
│      ───────────────────────          │
│      JWT 鉴权 · RBAC 权限 · 文件存储   │
└──────────────────┬───────────────────┘
                   │
┌──────────────────▼───────────────────┐
│              MySQL 8.0+                │
│      逻辑删除 · 字符集 utf8mb4          │
└──────────────────────────────────────┘
```

### 3.2 前端技术选型

| 层级 | 技术 | 说明 |
|------|------|------|
| **框架** | Uni-app（推荐）或微信原生小程序 | Uni-app 支持一次开发多端适配 |
| **UI 库** | uView UI / Vant Weapp | 轻量级移动端组件库 |
| **状态管理** | Vuex / Pinia（Uni-app） | 全局状态如登录态、扫码结果 |
| **网络请求** | uni.request / wx.request 封装 | 统一拦截器、Token 注入、错误处理 |
| **扫码能力** | wx.scanCode | 原生扫码 API |

### 3.3 后端技术选型

| 层级 | 技术 | 版本要求 |
|------|------|---------|
| **框架** | Spring Boot | 2.7.x / 3.x |
| **ORM** | MyBatis-Plus | 3.5.x |
| **安全** | Spring Security + JWT | — |
| **文件存储** | 本地存储 / 阿里云 OSS | 支持切换 |
| **日志** | SLF4J + Logback | — |
| **API 文档** | Knife4j / Swagger | 3.x |
| **校验** | Hibernate Validator | — |
| **工具** | Hutool / Guava | — |

### 3.4 数据库

| 项目 | 选型 |
|------|------|
| **数据库** | MySQL 8.0+ |
| **字符集** | utf8mb4 |
| **排序规则** | utf8mb4_general_ci |
| **连接池** | HikariCP（Spring Boot 默认） |

---

## 4. 数据库规范

### 4.1 命名规范

```
✅ 正确示例：
  表名：    supplier_info
  字段名：  raw_material_type
           batch_number
           inspection_report_url

❌ 错误示例：
  表名：    SupplierInfo（大写）
           gys_info（拼音）
           tbl_si（无意义缩写）

  字段名：  rawMaterialType（驼峰）
           ylj_type（拼音）
           rmt（缩写）
```

### 4.2 强制字段

**每张业务表必须包含以下字段：**

```sql
id          BIGINT       PRIMARY KEY AUTO_INCREMENT  COMMENT '主键ID',
create_time DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
update_time DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
is_deleted  TINYINT(1)   NOT NULL DEFAULT 0 COMMENT '逻辑删除：0=未删除，1=已删除'
```

### 4.3 推荐公共字段

根据业务需要，以下字段建议在相关表中出现：

```sql
created_by    BIGINT       COMMENT '创建人ID',
updated_by    BIGINT       COMMENT '更新人ID',
status        TINYINT      COMMENT '状态：0=禁用，1=启用',
audit_status  VARCHAR(20)  COMMENT '审核状态：PENDING/APPROVED/REJECTED',
remark        VARCHAR(500) COMMENT '备注'
```

### 4.4 字段类型约定

| 数据类型 | 使用场景 | 示例 |
|---------|---------|------|
| `BIGINT` | 主键、外键、分布式 ID | `id`, `supplier_id` |
| `VARCHAR(N)` | 字符串，N 根据业务确定 | `name VARCHAR(100)` |
| `TEXT` | 长文本（>500 字符） | `description TEXT` |
| `DECIMAL(M,D)` | 金额、百分比、数值 | `price DECIMAL(10,2)` |
| `TINYINT` | 布尔值、状态枚举 | `is_deleted`, `status` |
| `DATETIME` | 时间戳 | `create_time` |
| `DATE` | 纯日期 | `production_date` |
| `JSON` | 扩展字段（谨慎使用） | `extra_attributes JSON` |

### 4.5 索引规范

- 主键索引：每表必须有 `PRIMARY KEY (id)`
- 逻辑删除索引：`INDEX idx_is_deleted (is_deleted)`
- 外键索引：所有 `_id` 后缀的关联字段建立索引
- 查询索引：根据实际查询场景建立联合索引
- 命名格式：`idx_表名_字段名`

### 4.6 表设计原则

1. 单表字段数不超过 30 个
2. 避免使用外键约束（在应用层保证一致性）
3. 预留给 JSON 扩展的字段不超过 1-2 个
4. 逻辑删除 **绝不** 物理删除
5. 敏感字段（如手机号、身份证号）考虑加密存储

---

## 5. 后端架构规范

### 5.1 分层结构（MANDATORY）

```
src/main/java/com/traceher/
├── controller/          # 控制器层 — 仅做参数接收和响应封装
├── service/             # 服务接口
├── service/impl/        # 服务实现 — 全部业务逻辑在此
├── mapper/              # MyBatis Mapper 接口
├── entity/              # 数据库实体
├── dto/                 # 数据传输对象（入参）
├── vo/                  # 视图对象（出参）
├── config/              # Spring 配置
├── security/            # 安全相关（JWT、权限）
├── exception/           # 全局异常处理
├── common/              # 公共工具、常量、枚举
└── enums/               # 业务枚举
```

### 5.2 分层约束

| 层 | 允许做的事 | 禁止做的事 |
|----|-----------|-----------|
| **Controller** | 参数校验、调用 Service、封装响应 | 编写业务逻辑、直接操作数据库 |
| **Service** | 业务编排、事务管理、调用 Mapper | 直接处理 HTTP 请求/响应 |
| **Mapper** | SQL 映射、数据访问 | 编写业务逻辑、处理业务异常 |

### 5.3 类命名规范

```
Controller:   XxxController       →  ProductController
Service:      XxxService          →  ProductService
ServiceImpl:  XxxServiceImpl      →  ProductServiceImpl
Mapper:       XxxMapper           →  ProductMapper
Entity:       Xxx                 →  Product
DTO:          XxxDTO              →  ProductSaveDTO, ProductQueryDTO
VO:           XxxVO               →  ProductVO, ProductDetailVO
Enum:         XxxEnum             →  AuditStatusEnum
Config:       XxxConfig           →  SecurityConfig
Exception:    XxxException        →  BusinessException
```

### 5.4 方法命名约定

| 操作 | 命名前缀 | 示例 |
|------|---------|------|
| 查询单条 | `get` | `getProductById(Long id)` |
| 查询列表 | `list` | `listProducts(ProductQueryDTO dto)` |
| 分页查询 | `page` | `pageProducts(PageQueryDTO dto)` |
| 新增 | `save` / `add` | `saveProduct(ProductSaveDTO dto)` |
| 修改 | `update` | `updateProduct(ProductUpdateDTO dto)` |
| 删除 | `delete` / `remove` | `deleteProduct(Long id)` |
| 审核 | `audit` / `approve` / `reject` | `auditSupplier(Long id, AuditDTO dto)` |
| 提交 | `submit` | `submitInspectionReport(ReportDTO dto)` |

### 5.5 代码质量要求

- ✅ 每个核心业务逻辑块必须包含清晰的中文注释
- ✅ 单个 ServiceImpl 不超过 500 行（超出则拆分）
- ✅ 避免重复代码 → 提取公共方法或工具类
- ✅ 避免硬编码角色判断 → 使用枚举和权限注解
- ✅ 禁止 SQL 字符串拼接 → 使用 MyBatis-Plus 条件构造器
- ✅ 事务注解 `@Transactional` 仅加在 ServiceImpl 层

---

## 6. API 规范

### 6.1 统一响应结构

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

**响应码约定：**

| code | 含义 |
|------|------|
| 200 | 操作成功 |
| 400 | 参数校验失败 |
| 401 | 未登录 / Token 过期 |
| 403 | 无权限 |
| 404 | 资源不存在 |
| 409 | 业务冲突（如重复提交） |
| 500 | 服务器内部错误 |

### 6.2 分页响应结构

```json
{
  "code": 200,
  "message": "success",
  "data": {
    "records": [],
    "total": 100,
    "page": 1,
    "pageSize": 10,
    "totalPages": 10
  }
}
```

### 6.3 URL 设计规范

```
✅ RESTful 风格：
GET     /api/v1/products              查询产品列表
GET     /api/v1/products/{id}         查询产品详情
POST    /api/v1/products              新增产品
PUT     /api/v1/products/{id}         更新产品
DELETE  /api/v1/products/{id}         删除产品（逻辑删除）

✅ 业务操作：
POST    /api/v1/products/{id}/submit       提交审核
POST    /api/v1/suppliers/{id}/audit       审核供应商
GET     /api/v1/products/{id}/trace        查询溯源链路
```

**URL 约束：**
- 全部小写
- 多单词用连字符 `-` 分隔（路径段内部）
- 资源名用复数形式
- 版本号前缀：`/api/v1/`
- 不使用动词做路径（用 HTTP Method 表达操作）

### 6.4 全局异常处理

```java
// 统一异常处理结构
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(BusinessException.class)
    public Result<?> handleBusinessException(BusinessException e) {
        return Result.error(e.getCode(), e.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public Result<?> handleValidationException(MethodArgumentNotValidException e) {
        // 统一处理参数校验失败
    }

    @ExceptionHandler(Exception.class)
    public Result<?> handleException(Exception e) {
        // 兜底异常处理，记录日志
    }
}
```

---

## 7. 前端架构规范

### 7.1 小程序页面设计原则

| 原则 | 说明 |
|------|------|
| **轻量化** | 单页代码不超过 300 行，组件化拆分 |
| **移动优先** | 适配 iPhone SE ~ iPad 全尺寸 |
| **扫码优先** | 首页核心入口为扫码按钮，减少点击路径 |
| **上传友好** | 支持拍照 / 相册 / 文件选择多种上传方式 |
| **反馈及时** | 网络请求有 loading 状态，错误有明确提示 |

### 7.2 Uni-app 目录结构（推荐）

```
src/
├── pages/               # 页面目录
│   ├── index/           # 首页（扫码入口）
│   ├── scan/            # 扫码结果页
│   ├── product/         # 产品详情
│   ├── upload/          # 上传中心（供应商）
│   ├── audit/           # 审核中心（平台）
│   └── user/            # 个人中心
├── components/          # 公共组件
│   ├── scan-button/     # 扫码按钮
│   ├── safety-badge/    # 安全评级徽章
│   ├── trace-timeline/  # 溯源时间线
│   └── image-uploader/  # 图片上传组件
├── api/                 # API 接口封装
│   ├── request.js       # 统一请求拦截器
│   ├── product.js       # 产品相关 API
│   └── supplier.js      # 供应商相关 API
├── store/               # 状态管理
├── utils/               # 工具函数
└── static/              # 静态资源
```

### 7.3 交互设计约束

- 页面层级不超过 3 层（首页 → 列表 → 详情）
- 避免横向滚动
- 按钮最小触控区域 44×44 pt
- 表单字段不超过 8 个时不使用分组
- 文件上传必须显示缩略图预览
- 列表加载使用触底分页（scroll-view + loadmore）

---

## 8. 角色与权限模型

### 8.1 角色定义

| 角色 | 英文标识 | 核心功能 |
|------|---------|---------|
| **消费者** | `CONSUMER` | 扫码查询、查看溯源信息、投诉反馈 |
| **供应商** | `SUPPLIER` | 原料上报、批次管理、资质文件管理 |
| **生产商** | `MANUFACTURER` | 生产批次管理、质检报告上传 |
| **质检方** | `INSPECTOR` | 检测报告录入、安全评级建议 |
| **监管方** | `REGULATOR` | 全链路数据查询、合规抽查、审计报告导出 |
| **平台管理员** | `ADMIN` | 用户管理、角色分配、审批流程管理、系统配置 |

### 8.2 权限控制策略

```
请求到达
    │
    ▼
Token 解析 ─── 无效 → 401
    │
    ▼
角色提取
    │
    ▼
权限注解检查  ─── 无权限 → 403
    │
    ▼
Controller 方法执行
```

- 使用 `@PreAuthorize` 注解进行方法级权限控制
- 权限以 `ROLE_` 前缀定义
- 数据隔离：供应商只能操作自己的原料和批次数据

### 8.3 角色隔离原则

- 消费者不接触供应商管理界面
- 供应商不接触审核工作流
- 平台管理员不直接操作业务数据录入
- 每个角色仅看到自己被授权的菜单和按钮

---

## 9. 核心业务模块

### 9.1 模块清单

```
TraceHer
├── 用户模块（user）
│   ├── 注册 / 登录
│   ├── 角色绑定
│   └── 个人信息管理
│
├── 产品模块（product）
│   ├── 产品定义（品类、品牌、规格）
│   ├── 批次管理
│   └── 溯源二维码生成
│
├── 原料模块（raw-material）
│   ├── 原料类型（棉花 / 无纺布 / 高分子吸收树脂 / 热熔胶）
│   ├── 供应商供货记录
│   └── 原料检测报告
│
├── 生产模块（production）
│   ├── 生产工单
│   ├── 产线记录
│   └── 过程质检
│
├── 检测模块（inspection）
│   ├── 检测标准定义
│   ├── 检测报告上传
│   └── 检测结果录入
│
├── 溯源模块（trace）
│   ├── 全链路查询
│   ├── 节点时间线
│   └── 防伪验证
│
├── 审核模块（audit）
│   ├── 供应商资质审核
│   ├── 原料合规审核
│   ├── 检测报告审核
│   └── 审核历史查询
│
├── 预警模块（alert）
│   ├── 检测异常标记
│   ├── 投诉趋势监控
│   └── 风险等级通知
│
└── 附件模块（attachment）
    ├── 文件上传
    ├── 类型分类存储
    └── 文件预览 / 下载
```

### 9.2 模块间依赖关系

```
user ─── 基础模块，所有模块依赖
  │
product ─── 依赖 raw-material, production, inspection
  │
trace ─── 读取 product, raw-material, production, inspection
  │
audit ─── 依赖 supplier(用户), raw-material, inspection
  │
alert ─── 监听 inspection, trace 的异常数据
  │
attachment ─── 被所有业务模块引用
```

---

## 10. 审批工作流规范

### 10.1 审批类型

| 审批类型 | 触发方 | 审批方 | 说明 |
|---------|--------|--------|------|
| **供应商入驻审批** | 供应商 | 平台管理员 | 审核企业资质文件 |
| **原料合规审批** | 供应商 | 质检方 / 平台 | 原料检测报告审核 |
| **产品上市审批** | 生产商 | 质检方 / 平台 | 批次检测合格确认 |
| **异常复审批** | 平台 | 质检方 / 监管方 | 检测异常的二次确认 |

### 10.2 审批状态机

```
PENDING          # 待提交
    │
    ▼
SUBMITTED        # 已提交，待审核
    │
    ├──► APPROVED      # 审核通过
    │
    └──► REJECTED      # 审核驳回（可重新提交）
              │
              ▼
          RESUBMITTED   # 重新提交（回到 SUBMITTED 流转）
```

### 10.3 审批表设计约定

审批记录使用独立的 `audit_record` 表：

```sql
audit_record:
  - id
  - business_type    VARCHAR(30)   # 业务类型：SUPPLIER_REG / MATERIAL_COMPLIANCE / PRODUCT_RELEASE
  - business_id      BIGINT        # 关联业务ID
  - audit_node       VARCHAR(50)   # 审批节点名称
  - auditor_id       BIGINT        # 审批人ID
  - audit_status     VARCHAR(20)   # PENDING / APPROVED / REJECTED
  - audit_comment    TEXT          # 审批意见
  - audit_time       DATETIME      # 审批时间
  - attachments      JSON          # 审批相关附件（可选）
  - create_time / update_time / is_deleted
```

---

## 11. 附件管理规范

### 11.1 附件类型分类

| 类型 | 英文标识 | 示例 |
|------|---------|------|
| 企业资质 | `BIZ_LICENSE` | 营业执照、生产许可证 |
| 原料检测报告 | `MATERIAL_INSPECTION` | 棉花检测报告、无纺布检测报告 |
| 产品检测报告 | `PRODUCT_INSPECTION` | 成品微生物检测、荧光剂检测 |
| 产品图片 | `PRODUCT_IMAGE` | 包装照片、产品实拍 |
| 工厂文档 | `FACTORY_DOC` | 车间环境报告、GMP 认证 |
| 其他文件 | `OTHER` | 补充材料 |

### 11.2 附件存储规范

```
存储路径规则：/{attachment_type}/{yyyy-MM}/{business_id}/{uuid}.{ext}

示例：
/product_inspection/2026-05/128/abc123def.pdf
/biz_license/2026-05/42/xyz789.jpg
```

### 11.3 文件上传校验

| 校验项 | 规则 |
|--------|------|
| **文件类型** | 白名单：jpg, jpeg, png, pdf, doc, docx, xls, xlsx |
| **文件大小** | 图片 ≤ 10MB，文档 ≤ 20MB |
| **文件数量** | 单次上传 ≤ 9 个文件 |
| **文件名** | 过滤特殊字符，重命名为 UUID |

### 11.4 附件表设计

```sql
attachment:
  - id
  - business_type    VARCHAR(30)    # 关联业务类型
  - business_id      BIGINT         # 关联业务ID
  - attachment_type  VARCHAR(30)    # 附件分类
  - file_name        VARCHAR(200)   # 原始文件名
  - file_path        VARCHAR(500)   # 存储路径
  - file_size        BIGINT         # 文件大小（字节）
  - file_ext         VARCHAR(10)    # 文件扩展名
  - uploader_id      BIGINT         # 上传人ID
  - sort_order       INT DEFAULT 0  # 排序
  - create_time / update_time / is_deleted
```

---

## 12. 安全规范

### 12.1 鉴权机制

```
注册 / 登录
    │
    ▼
JWT Token 签发（包含 userId + roles）
    │
    ▼
每次请求 Header 携带：Authorization: Bearer {token}
    │
    ▼
Spring Security Filter 拦截验证
    │
    ▼
通过 → 路由到 Controller / 失败 → 返回 401
```

**Token 规范：**
- Token 有效期：7 天（可配置）
- 续期策略：距过期 < 1 天时自动续期
- 登出：客户端清除 Token（不做服务端黑名单，MVP 阶段）

### 12.2 安全防护清单

| 防护项 | 实现方式 |
|--------|---------|
| **SQL 注入** | MyBatis-Plus 条件构造器 + 参数化查询 |
| **XSS** | 前端输出编码 + 后端输入过滤 |
| **CSRF** | Token 校验（小程序环境风险较低，但保留防护） |
| **文件上传** | 类型白名单 + 大小限制 + 重命名 |
| **敏感数据** | 手机号脱敏、密码 BCrypt 加密 |
| **接口限流** | IP 级别限流（登录接口 5次/分钟） |
| **操作日志** | 关键操作记录到 `operation_log` 表 |

### 12.3 数据隔离

- 供应商只能查询和操作自己的数据（通过 `supplier_id` 隔离）
- 生产商只能管理自己工厂下的产品批次
- 平台管理员可跨域查询，但不可修改业务数据
- 消费者只能查看公开的溯源信息

---

## 13. 部署与运维规范

### 13.1 环境划分

| 环境 | 用途 | 配置来源 |
|------|------|---------|
| **dev** | 本地开发 | application-dev.yml |
| **test** | 测试环境 | application-test.yml |
| **prod** | 生产环境 | application-prod.yml |

### 13.2 日志规范

```
日志级别：
  dev:   DEBUG（开发调试）
  test:  INFO
  prod:  WARN  （只记录警告和错误）

日志格式：
  [%d{yyyy-MM-dd HH:mm:ss}] [%thread] [%-5level] [%logger{36}] - %msg%n

日志存储：
  按天滚动，保留 30 天
  单文件最大 100MB
```

### 13.3 操作日志

所有 CUD 操作（Create / Update / Delete）必须记录到 `operation_log` 表：

```sql
operation_log:
  - id
  - user_id          BIGINT         # 操作人
  - operation_type   VARCHAR(30)    # INSERT / UPDATE / DELETE
  - business_type    VARCHAR(30)    # 业务模块
  - business_id      BIGINT         # 业务数据ID
  - detail           JSON           # 变更明细（可选）
  - ip_address       VARCHAR(50)    # 操作IP
  - create_time
```

---

## 14. AI 助手行为准则

> 本节对所有 AI 编码助手（Claude Code、GitHub Copilot、Cursor 等）具有最终约束力。

### 14.1 必须遵守

1. **严禁擅自修改架构。** 任何架构级变更必须由开发者发起，AI 仅能在给定架构内实现。
2. **严禁生成混乱的命名。** 严格遵循本文档 4.1 节命名规范。
3. **严禁混入无关业务概念。** 严禁引入医疗、报销、保险、教务等无关概念。
4. **严禁跳过业务边界分析。** 新增模块前必须明确该模块的输入、输出和依赖边界。
5. **始终优先考虑可维护性。** 宁可代码多一点，也不要过度抽象。
6. **始终优先考虑模块边界清晰。** 一个模块只做一件事。
7. **始终从未来可扩展的角度思考。** 但不能以牺牲当前简洁性为代价。
8. **始终生成面向生产的代码。** 包含必要的校验、异常处理和日志。

### 14.2 代码生成规范

- 每次输出代码前，先确认目标模块和文件位置
- 中文注释写在关键业务逻辑上方
- 不在代码中使用 Emoji
- 不使用 `System.out.println` — 使用 `log.info / log.warn / log.error`
- 不生成空的 try-catch 块
- 不在 Entity 中写业务逻辑

### 14.3 禁止的操作

- ❌ 不向 Controller 中写入业务逻辑
- ❌ 不使用 `SELECT *`
- ❌ 不硬编码角色和权限判断
- ❌ 不跳过参数校验
- ❌ 不返回未经包装的原始错误堆栈给前端
- ❌ 不直接拼接 SQL 字符串

---

## 15. AI 输出顺序规范

> 当 AI 助手实现一个新模块时，**必须** 按以下顺序输出：

### 15.1 标准输出顺序

```
1.  业务理解（Business Understanding）
    └── 一句话概述模块目标 + 核心场景说明

2.  用户角色（User Roles）
    └── 涉及哪些角色，各自的职责和交互方式

3.  数据流（Data Flow）
    └── 数据从哪里来 → 经过什么处理 → 到哪里去

4.  数据库表（Database Tables）
    └── 表结构 DDL + 索引设计 + 字段说明

5.  API 设计（API Design）
    └── 接口列表、请求/响应结构、错误码

6.  后端实现（Backend Implementation）
    └── Controller → Service → ServiceImpl → Mapper → Entity → DTO → VO

7.  前端交互逻辑（Frontend Interaction）
    └── 页面结构、组件拆分、状态管理、交互流程

8.  安全考虑（Security Considerations）
    └── 权限控制、数据隔离、输入校验、敏感信息保护

9.  未来可扩展性（Future Extensibility）
    └── 可能的需求变化方向及预留扩展点
```

### 15.2 执行约束

- 不可跳过任何一个步骤
- 如果某步骤在当前模块不适用，需明确说明"不适用"及原因
- 步骤 4（数据库表）必须先于步骤 6（后端实现）
- 步骤 8（安全）是强制环节，不可省略

---

## 16. 术语表

### 16.1 业务术语

| 中文 | 英文 | 说明 |
|------|------|------|
| 溯源 | Traceability | 从原料到成品的全链路追踪 |
| 批次 | Batch / Lot | 生产批次号，溯源的核心单位 |
| 原料 | Raw Material | 卫生用品的原材料（棉花、无纺布等） |
| 安全评级 | Safety Rating | 对产品的综合安全评分（如 A+、A、B 等） |
| 荧光剂 | Fluorescent Agent | 卫生用品中可能存在的增白化学物质 |
| 防伪验证 | Anti-Counterfeit | 确认产品为正品的验证机制 |
| 供应链 | Supply Chain | 从原料供应到消费者购买的全过程 |
| 审核 | Audit / Review | 平台对供应商/产品资质的合规审查 |
| 资质 | Qualification | 供应商的各类证照和许可文件 |
| 节点 | Node | 溯源链路上的关键环节 |
| 工单 | Work Order | 生产过程中的任务单据 |

### 16.2 技术术语

| 中文 | 英文 | 说明 |
|------|------|------|
| 逻辑删除 | Soft Delete | 标记 is_deleted=1 而非物理删除 |
| 统一响应 | Unified Response | 所有 API 返回相同结构的 JSON |
| 中台 | Middle Platform | 企业级可复用的业务能力中心 |
| 角色隔离 | Role Isolation | 不同角色只能访问授权的数据和功能 |
| 审批流 | Approval Workflow | 多环节、多角色的审核流程 |

---

## 附录 A：项目文件结构总览

```
D:\traceher\
├── agent.md                  # 本文件 — 项目最高宪法
├── PRD/                      # 产品需求文档
├── backend/                  # Java Spring Boot 后端
│   └── src/main/java/com/traceher/
│       ├── controller/
│       ├── service/
│       ├── service/impl/
│       ├── mapper/
│       ├── entity/
│       ├── dto/
│       ├── vo/
│       ├── config/
│       ├── security/
│       ├── exception/
│       ├── common/
│       └── enums/
├── frontend/                 # Uni-app 小程序前端
│   └── src/
│       ├── pages/
│       ├── components/
│       ├── api/
│       ├── store/
│       ├── utils/
│       └── static/
├── database/                 # 数据库脚本
│   ├── schema/               # DDL 建表脚本
│   └── seed/                 # 种子数据
└── docs/                     # 项目文档
    ├── api/                  # API 文档
    ├── architecture/         # 架构图
    └── changelog/            # 变更记录
```

## 附录 B：项目依赖版本锁定

| 依赖 | 版本 | 说明 |
|------|------|------|
| Java | 17+ (LTS) | 推荐使用 Java 17 |
| Spring Boot | 2.7.x | 稳定生产版本 |
| MyBatis-Plus | 3.5.5 | — |
| MySQL | 8.0.33+ | — |
| JWT (jjwt) | 0.12.x | — |
| Knife4j | 4.3.x | API 文档 |
| Hutool | 5.8.x | 工具库 |
| Lombok | 1.18.x | 减少样板代码 |

---

> **本文档优先级声明：**
>
> 本文件 (`agent.md`) 是 TraceHer (卫溯) 项目的最高技术宪法。
> 任何需求文档、技术方案、代码实现如与本文件冲突，以本文件为准。
> 本文档的修改需经过明确评审，并更新版本号。
