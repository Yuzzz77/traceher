# TraceHer（卫溯）MVP 产品需求文档

> 版本：v1.0  
> 日期：2026-05-26  
> 状态：MVP 定义完成，待进入开发

---

## 1. 产品定义

### 1.1 一句话描述

TraceHer 是一个面向女性卫生用品的供应链溯源验证平台——消费者扫码即可查看产品的检测结果与安全状态，而非仅看到"验证通过"四个字。

### 1.2 核心用户与痛点

| 用户角色 | 核心痛点 |
|---------|---------|
| **消费者** | 花钱买了产品，但无法确认用的棉是不是黑心棉、有没有荧光剂 |
| **供应商** | 提交了合规材料，但缺乏一个能让消费者直接查证的平台 |
| **平台运营** | 需要一套规则来区分"供应商自述"和"平台认证" |

### 1.3 MVP 范围边界

**MVP 做这些：**
- 消费者扫码 → 查看验证结果页
- 供应商上传检测报告 → 平台审核 → 绑定批次
- 二维码生成 + 质检后激活
- 不合格批次冻结 + 消费者端预警提示
- 防伪码 → 产品批次 → 原料批次 → 供应商 的逆向追溯

**MVP 不做这些：**
- 第三方检测机构 API 直连（用白名单 + 抽查替代）
- AI 自动审核
- 物流追踪
- 消费者社区 / UGC 评论
- 大数据看板

---

## 2. 核心设计原则（来自三轮讨论）

### 2.1 消费者结果页：少而关键

消费者看到的信息，必须满足两个条件：(1) 能看懂；(2) 能与"安全"直接关联。

**展示优先级排序：**

| 优先级 | 展示内容 | 理由 |
|--------|---------|------|
| **P0 必须** | 荧光剂检测结果（如：未检出） | 消费者最恐惧的指标，无需专业知识即可理解 |
| **P0 必须** | 有害物质检测结果（甲醛、重金属等） | 直接关联安全性 |
| **P0 必须** | 当前质检状态（已认证 / 风险预警 / 未通过） | 一目了然的状态判断 |
| **P1 重要** | 是否通过第三方检测机构认证 | 增强可信度 |
| **P1 重要** | 产品批次 + 生产日期 | 辅助判断新鲜度和可追溯性 |
| **P2 辅助** | 棉花产地 | 品牌/来源信息，不直接证明安全 |
| **不展示** | 检测编号（如 SGS-2026-0827） | 消费者无感知价值，仅用于系统内部追溯 |

### 2.2 二维码生成 ≠ 二维码生效

- **生成阶段：** 二维码可在生产封装时提前生成并绑定产品批次
- **生效阶段：** 仅在质检通过后，系统将二维码状态改为"已认证/可查询"
- **核心原因：** 防止消费者扫到未检测产品，出现空数据，损害平台信任

### 2.3 供应商声明 ≠ 平台认证

- 供应商提交的数据默认不可信
- 必须经过"系统规则校验 + 人工复核"后才可展示给消费者
- 审核通过的状态分层打在两个地方：(1) 报告上；(2) 批次上

### 2.4 系统不止展示"好的"，也要处理"坏的"

- 不合格批次的二维码不激活，且系统主动提示"该批次未通过质检"
- 追踪不合格产品的去向（销毁/召回记录）
- 同一问题原料影响的产品批次可被批量标记

### 2.5 信任不是来自某个人，而是来自机制

```
信任 = 系统规则校验 + 人工复核 + 数据交叉验证 + 可追溯链路
```

---

## 3. 用户角色与权限

| 角色 | 标识 | MVP 阶段功能 |
|------|------|-------------|
| **消费者** | `CONSUMER` | 扫码查询、查看验证结果、投诉举报 |
| **供应商** | `SUPPLIER` | 上传检测报告、管理批次、查看审核状态 |
| **平台审核员** | `AUDITOR` | 审核报告、处理异常、管理白名单、冻结/解冻批次 |
| **管理员** | `ADMIN` | 角色分配、系统配置、全局数据查看 |

---

## 4. 核心业务流程图

### 4.1 正向流程（原料 → 消费者）

```
原料采购
  │
  ▼
原料入库（生成原料批次号）
  │
  ▼
生产加工（生成产品批次号）
  │
  ▼
成品封装（生成二维码，状态=未激活）
  │
  ▼
质检检测（上传检测报告）
  │
  ├── 通过 ──→ 系统激活二维码（状态=已认证）──→ 消费者可查询
  │
  └── 不通过 ──→ 批次冻结 ──→ 记录原因 ──→ 等待销毁/召回
```

### 4.2 逆向追溯（消费者投诉 → 问题源头）

```
消费者投诉（提供防伪码）
  │
  ▼
防伪码 → 产品批次
  │
  ▼
产品批次 → 原料-产品关联表 → 原料批次(们)
  │
  ▼
原料批次 → 供应商
  │
  ▼
系统查询：同一原料批次还影响了哪些产品批次？
  │
  ▼
批量标记风险 → 通知相关消费者 → 启动召回
```

### 4.3 审核流程

```
供应商上传检测报告
  │
  ▼
系统自动校验
  ├── 检测日期是否有效
  ├── 检测机构是否在白名单内
  ├── 报告编号格式是否合规
  └── 产品批次是否匹配
  │
  ├── 全部通过 ──→ 自动标记"已认证"（低风险报告）
  │
  └── 异常 / 不确定 ──→ 进入人工复核队列
        │
        ├── 审核通过 ──→ 标记"已认证"
        └── 驳回 ──→ 通知供应商重新提交
```

---

## 5. 核心数据模型

### 5.1 实体关系总览

```
supplier (供应商)
    │
    │ 1:N
    ▼
raw_material_batch (原料批次)
    │
    │ N:M (通过关联表)
    ▼
product_batch (产品批次)
    │
    │ 1:1
    ▼
qr_code (防伪二维码)
    │
    │ 消费者扫码查询
    ▼
verification_result (查询结果)

product_batch
    │
    │ 1:N
    ▼
inspection_report (检测报告)
    │
    │ 1:N
    ▼
inspection_result (检测结果明细)
```

### 5.2 关键表结构

#### supplier（供应商）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键 |
| company_name | VARCHAR(100) | 公司名称 |
| contact_name | VARCHAR(50) | 联系人 |
| contact_phone | VARCHAR(20) | 联系电话 |
| license_number | VARCHAR(50) | 营业执照号 |
| risk_level | VARCHAR(20) | 风险等级：NORMAL / WARNING / HIGH |
| audit_status | VARCHAR(20) | 审核状态：PENDING / APPROVED / REJECTED |
| create_time / update_time / is_deleted | — | 基础字段 |

#### raw_material_batch（原料批次）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键 |
| supplier_id | BIGINT | 供应商ID |
| material_type | VARCHAR(30) | 原料类型：COTTON / NONWOVEN / SAP / HOTMELT |
| batch_number | VARCHAR(50) | 原料批次号 |
| material_name | VARCHAR(100) | 原料名称 |
| quantity | DECIMAL(10,2) | 数量 |
| unit | VARCHAR(10) | 单位 |
| risk_status | VARCHAR(20) | 风险状态：NORMAL / FROZEN / WARNING |
| create_time / update_time / is_deleted | — | 基础字段 |

#### product_batch（产品批次 — 核心关联节点）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键 |
| batch_number | VARCHAR(50) | 产品批次号（唯一） |
| product_name | VARCHAR(100) | 产品名称 |
| category | VARCHAR(30) | 品类：PAD / TAMPON / LINER |
| production_date | DATE | 生产日期 |
| production_line | VARCHAR(50) | 产线编号 |
| batch_status | VARCHAR(20) | 批次状态：UNVERIFIED / VERIFIED / FROZEN / RECALLED |
| audit_status | VARCHAR(20) | 审核状态：PENDING / APPROVED / REJECTED |
| create_time / update_time / is_deleted | — | 基础字段 |

#### batch_material_rel（原料-产品关联表）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键 |
| product_batch_id | BIGINT | 产品批次ID |
| raw_material_batch_id | BIGINT | 原料批次ID |
| usage_ratio | DECIMAL(5,2) | 该原料在此批次中的用量占比(%) |
| create_time / update_time / is_deleted | — | 基础字段 |

> **设计说明：** 这张表实现了"N对M"关系。一个产品批次可以用多个原料批次；同一个原料批次也可能供应了多个产品批次。这是逆向追溯的关键。

#### qr_code（防伪二维码）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键 |
| qr_code_value | VARCHAR(100) | 二维码唯一值（加密生成） |
| product_batch_id | BIGINT | 关联产品批次ID |
| qr_status | VARCHAR(20) | 状态：INACTIVE（未激活）/ ACTIVE（已激活）/ FROZEN（已冻结）/ REVOKED（已作废） |
| activated_time | DATETIME | 激活时间 |
| create_time / update_time / is_deleted | — | 基础字段 |

> **设计说明：** 二维码可以在生产封装时提前生成（状态=INACTIVE），只有在质检通过后才更新为 ACTIVE。这样消费者扫到未激活的码，系统知道是"还没检测"而不是系统故障。

#### inspection_report（检测报告）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键 |
| report_number | VARCHAR(50) | 报告编号 |
| inspection_agency | VARCHAR(100) | 检测机构名称 |
| product_batch_id | BIGINT | 关联产品批次ID |
| report_file_url | VARCHAR(500) | 原始报告文件路径 |
| inspection_date | DATE | 检测日期 |
| report_status | VARCHAR(20) | 报告状态：PENDING / APPROVED / REJECTED |
| auditor_id | BIGINT | 审核人ID（系统自动通过则为NULL） |
| audit_time | DATETIME | 审核时间 |
| audit_comment | TEXT | 审核意见 |
| create_time / update_time / is_deleted | — | 基础字段 |

#### inspection_result（检测结果明细）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键 |
| report_id | BIGINT | 关联检测报告ID |
| item_name | VARCHAR(50) | 检测项名称：fluorescent_agent / formaldehyde / bacteria / heavy_metal / ph |
| item_label | VARCHAR(50) | 检测项中文名：荧光剂 / 甲醛 / 细菌 / 重金属 / pH值 |
| result_value | VARCHAR(50) | 检测结果值 |
| result_level | VARCHAR(20) | 结果等级：PASS / WARNING / FAIL |
| standard_range | VARCHAR(50) | 标准参考范围 |
| create_time / update_time / is_deleted | — | 基础字段 |

> **设计说明：** 一项指标一条记录。这样后续扩展检测项时无需改表结构，单项风险预警和统计也更方便。

#### complaint（消费者投诉）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键 |
| qr_code_value | VARCHAR(100) | 关联的防伪码 |
| product_batch_id | BIGINT | 关联的产品批次 |
| consumer_contact | VARCHAR(50) | 消费者联系方式 |
| complaint_type | VARCHAR(30) | 投诉类型：QUALITY / SAFETY / COUNTERFEIT / OTHER |
| description | TEXT | 投诉描述 |
| handle_status | VARCHAR(20) | 处理状态：PENDING / INVESTIGATING / RESOLVED |
| handle_result | TEXT | 处理结果 |
| create_time / update_time / is_deleted | — | 基础字段 |

#### operation_log（操作日志）

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键 |
| user_id | BIGINT | 操作人ID |
| operation_type | VARCHAR(30) | INSERT / UPDATE / DELETE |
| business_type | VARCHAR(30) | 业务模块 |
| business_id | BIGINT | 业务数据ID |
| detail | JSON | 变更明细 |
| ip_address | VARCHAR(50) | 操作IP |
| create_time | DATETIME | 操作时间 |

---

## 6. 状态机设计

### 6.1 二维码状态

```
INACTIVE（未激活）
    │
    │ 质检通过
    ▼
ACTIVE（已激活，可查询）
    │
    │ 检测异常 / 投诉核实
    ▼
FROZEN（已冻结，消费者扫码看到预警）
    │
    │ 产品召回
    ▼
REVOKED（已作废）
```

### 6.2 产品批次状态

```
UNVERIFIED（待验证）
    │
    │ 质检通过 + 报告审核通过
    ▼
VERIFIED（已认证）
    │
    │ 检测异常 / 投诉触发
    ▼
FROZEN（已冻结）
    │
    │ 召回完成 / 销毁确认
    ▼
RECALLED（已召回）
```

### 6.3 检测报告状态

```
PENDING（待审核）
    │
    ├── 系统自动校验通过 ──→ APPROVED（已通过）
    │
    └── 异常 ──→ 人工复核
          │
          ├── APPROVED
          └── REJECTED（驳回，可重新提交）
```

---

## 7. API 设计（MVP 核心接口）

### 7.1 消费者端

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/verify/scan` | 消费者扫码查询（入参：qr_code_value） |
| POST | `/api/v1/verify/manual` | 手动输入验证码查询 |
| POST | `/api/v1/complaints` | 提交投诉 |

### 7.2 扫码查询响应结构

```json
{
  "code": 200,
  "data": {
    "qr_status": "ACTIVE",
    "batch_status": "VERIFIED",
    "product": {
      "name": "纯棉日用卫生巾",
      "batch_number": "TH-2026-0827",
      "production_date": "2026-04-15",
      "category": "PAD"
    },
    "safety_results": [
      {
        "item_label": "荧光剂",
        "result_value": "未检出",
        "result_level": "PASS"
      },
      {
        "item_label": "甲醛",
        "result_value": "未检出",
        "result_level": "PASS"
      },
      {
        "item_label": "细菌菌落总数",
        "result_value": "<10 CFU/g",
        "result_level": "PASS"
      }
    ],
    "certification": {
      "agency_name": "SGS 通标标准技术服务有限公司",
      "report_verified": true
    },
    "verified_at": "2026-04-20T14:30:00"
  }
}
```

### 7.3 扫码查询 — 异常情况响应

```json
// 二维码未激活
{
  "code": 200,
  "data": {
    "qr_status": "INACTIVE",
    "message": "该产品暂未完成质检，请稍后再试"
  }
}

// 批次已冻结
{
  "code": 200,
  "data": {
    "qr_status": "FROZEN",
    "batch_status": "FROZEN",
    "message": "该批次产品未通过质检，请停止使用并联系平台",
    "risk_reason": "荧光剂检测超标",
    "hotline": "400-xxx-xxxx"
  }
}
```

### 7.4 供应商端

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/api/v1/supplier/reports` | 上传检测报告 |
| GET | `/api/v1/supplier/reports` | 我的报告列表 |
| GET | `/api/v1/supplier/reports/{id}` | 报告详情 |
| GET | `/api/v1/supplier/batches` | 我的批次列表 |

### 7.5 平台审核端

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/api/v1/audit/reports/pending` | 待审核报告列表 |
| POST | `/api/v1/audit/reports/{id}/approve` | 审核通过 |
| POST | `/api/v1/audit/reports/{id}/reject` | 审核驳回 |
| POST | `/api/v1/audit/batches/{id}/freeze` | 冻结批次 |
| POST | `/api/v1/audit/batches/{id}/unfreeze` | 解冻批次 |

---

## 8. 消费者结果页设计（前端关键页面）

### 8.1 正常情况页面结构

```
┌─────────────────────────────────┐
│         TraceHer 卫溯            │
│     ────────────────────         │
│                                 │
│       ┌───────────────┐         │
│       │               │         │
│       │   ✓ 已认证     │         │
│       │               │         │
│       └───────────────┘         │
│                                 │
│   纯棉日用卫生巾                  │
│   批次：TH-2026-0827             │
│   生产日期：2026年4月15日         │
│                                 │
│   ── 安全检测结果 ──             │
│                                 │
│   ✓ 荧光剂    未检出             │
│   ✓ 甲醛      未检出             │
│   ✓ 细菌      <10 CFU/g         │
│   ✓ pH值      5.5（弱酸性）      │
│                                 │
│   检测机构：SGS                   │
│   认证时间：2026年4月20日         │
│                                 │
│        [投诉/反馈]               │
└─────────────────────────────────┘
```

### 8.2 异常情况页面结构

```
┌─────────────────────────────────┐
│         TraceHer 卫溯            │
│     ────────────────────         │
│                                 │
│       ┌───────────────┐         │
│       │               │         │
│       │   ⚠ 风险预警   │         │
│       │               │         │
│       └───────────────┘         │
│                                 │
│   该批次产品未通过质检             │
│   请立即停止使用                  │
│                                 │
│   风险原因：荧光剂检测超标         │
│                                 │
│   如有疑问请联系：                │
│   客服热线：400-xxx-xxxx          │
│                                 │
│        [我要投诉]                │
└─────────────────────────────────┘
```

---

## 9. MVP 阶段风控策略

由于 MVP 阶段不做检测机构 API 直连，采用以下低成本风控措施：

| 措施 | 说明 | 实施难度 |
|------|------|---------|
| **检测机构白名单** | 仅允许已认证机构的报告进入系统 | 低 |
| **报告编号抽查** | 平台随机核验部分报告真实性 | 低 |
| **原始文件要求** | 必须上传完整 PDF/电子报告，不接受截图 | 低 |
| **高风险供应商加强复核** | 历史异常多的供应商提高人工审核频率 | 中 |
| **系统规则自动校验** | 日期有效性、机构白名单、格式合规、批次匹配 | 中 |

---

## 10. MVP 开发分期建议

### 第一期：核心验证链路（2-3 周）

- [ ] 供应商管理（注册、资质上传）
- [ ] 产品批次管理
- [ ] 原料批次管理
- [ ] 原料-产品关联
- [ ] 二维码生成与激活
- [ ] 消费者扫码查询（正常 + 异常）
- [ ] 消费者结果页（前端小程序页）

### 第二期：审核与风控（1-2 周）

- [ ] 检测报告上传
- [ ] 检测结果明细录入
- [ ] 系统自动校验规则
- [ ] 人工审核队列
- [ ] 批次冻结/解冻
- [ ] 风险预警提示

### 第三期：闭环能力（1-2 周）

- [ ] 消费者投诉反馈
- [ ] 逆向追溯查询（防伪码 → 供应商）
- [ ] 同批次影响范围查询
- [ ] 操作日志记录
- [ ] 销毁/召回记录

---

## 11. 关键设计决策记录

| 决策点 | 结论 | 原因 |
|--------|------|------|
| 二维码生成 vs 生效 | 分开两个阶段 | 防止消费者扫到未检测产品 |
| 检测结果存储方式 | 一项一条记录 | 便于扩展、单项预警和统计 |
| 供应商声明 vs 平台认证 | 默认不可信，需审核 | 防止供应商上传虚假数据 |
| 审核机制 | 系统规则 + 人工复核 | 效率与准确性的平衡 |
| 不合格产品展示 | 明确预警，不显示"暂无数据" | 避免消费者误解为系统故障 |
| 消费者结果页信息量 | 少而关键（5条以内） | 信息过载反而降低信任 |
| 检测编号是否展示 | 不展示 | 消费者无感知价值 |
| 检测机构 API 对接 | MVP 不做 | 实施成本高，用白名单+抽查替代 |
| 数据查询方式 | 实时查询数据库 | MVP 数据量小，不需要缓存层 |

---

> **本文档基于三轮 Socratic 讨论生成，所有设计决策均有明确的业务理由。**
> **进入开发阶段后，所有代码实现必须严格参照 `agent.md`（项目宪法）中的技术规范。**
