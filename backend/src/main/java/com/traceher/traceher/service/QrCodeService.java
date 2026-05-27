package com.traceher.traceher.service;

import com.traceher.traceher.entity.QrCode;

import java.util.List;

public interface QrCodeService {

    /**
     * Generate inactive QR codes for a product batch.
     */
    List<QrCode> generateQrCodes(Long productBatchId, Integer quantity);

    /**
     * Activate a QR code by QR code value.
     */
    QrCode activateQrCode(String qrCodeValue);

    /**
     * Query QR code information by QR code value.
     */
    QrCode getQrCodeInfo(String qrCodeValue);
}