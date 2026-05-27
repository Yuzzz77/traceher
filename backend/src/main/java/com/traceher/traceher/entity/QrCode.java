package com.traceher.traceher.entity;// 👈 注意：这里要改成你本地entity的实际路径！

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "qr_code")
public class QrCode {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String qrCodeValue;
    private Long productBatchId;
    private String qrStatus;
    private LocalDateTime activatedTime;
    private LocalDateTime createTime;
    private LocalDateTime updateTime;
    private Integer isDeleted;
}