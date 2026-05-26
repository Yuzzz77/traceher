package com.traceher.traceher.repository;

import com.traceher.traceher.entity.QrCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface QrCodeRepository extends JpaRepository<QrCode, Long> {

    /**
     * Query active QR code by exact QR code value.
     */
    @Query("select q from QrCode q where q.isDeleted = 0 and q.qrCodeValue = :qrCodeValue")
    Optional<QrCode> findByQrCodeValue(@Param("qrCodeValue") String qrCodeValue);

    /**
     * Query active QR codes by product batch ID.
     */
    @Query("select q from QrCode q where q.isDeleted = 0 and q.productBatchId = :productBatchId")
    List<QrCode> findByProductBatchId(@Param("productBatchId") Long productBatchId);
}