package com.traceher.traceher.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "product_batch")
public class ProductBatch {

    /**
     * 主键ID
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /**
     * 批次编号，唯一
     */
    private String batchNumber;

    /**
     * 产品名称
     */
    private String productName;

    /**
     * 产品类别
     */
    private String category;

    /**
     * 生产日期
     */
    private LocalDate productionDate;

    /**
     * 生产线
     */
    private String productionLine;

    /**
     * 批次状态，默认 UNVERIFIED
     */
    private String batchStatus;

    /**
     * 审核状态，默认 PENDING
     */
    private String auditStatus;

    /**
     * 创建时间
     */
    private LocalDateTime createTime;

    /**
     * 更新时间
     */
    private LocalDateTime updateTime;

    /**
     * 是否删除：0-未删除，1-已删除
     */
    private Integer isDeleted;
}