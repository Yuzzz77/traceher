package com.traceher.traceher.service.impl;

import com.traceher.traceher.entity.QrCode;
import com.traceher.traceher.repository.QrCodeRepository;
import com.traceher.traceher.service.QrCodeService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
public class QrCodeServiceImpl implements QrCodeService {

    private static final String QR_STATUS_INACTIVE = "INACTIVE";
    private static final String QR_STATUS_ACTIVE = "ACTIVE";
    private static final int NOT_DELETED = 0;

    private final QrCodeRepository qrCodeRepository;

    public QrCodeServiceImpl(QrCodeRepository qrCodeRepository) {
        this.qrCodeRepository = qrCodeRepository;
    }

    @Override
    @Transactional
    public List<QrCode> generateQrCodes(Long productBatchId, Integer quantity) {
        if (productBatchId == null) {
            throw new IllegalArgumentException("Product batch ID must not be null.");
        }
        if (quantity == null || quantity <= 0) {
            throw new IllegalArgumentException("Quantity must be greater than 0.");
        }

        List<QrCode> qrCodes = new ArrayList<>(quantity);
        Set<String> generatedValues = new HashSet<>();

        while (qrCodes.size() < quantity) {
            String qrCodeValue = UUID.randomUUID().toString();
            if (!generatedValues.add(qrCodeValue)) {
                continue;
            }

            QrCode qrCode = new QrCode();
            qrCode.setQrCodeValue(qrCodeValue);
            qrCode.setProductBatchId(productBatchId);
            qrCode.setQrStatus(QR_STATUS_INACTIVE);
            qrCode.setIsDeleted(NOT_DELETED);

            qrCodes.add(qrCode);
        }

        return qrCodeRepository.saveAll(qrCodes);
    }

    @Override
    @Transactional
    public QrCode activateQrCode(String qrCodeValue) {
        QrCode qrCode = getQrCodeInfo(qrCodeValue);
        qrCode.setQrStatus(QR_STATUS_ACTIVE);
        qrCode.setActivatedTime(LocalDateTime.now());
        return qrCodeRepository.save(qrCode);
    }

    @Override
    @Transactional(readOnly = true)
    public QrCode getQrCodeInfo(String qrCodeValue) {
        if (qrCodeValue == null || qrCodeValue.isBlank()) {
            throw new IllegalArgumentException("QR code value must not be blank.");
        }

        return qrCodeRepository.findByQrCodeValue(qrCodeValue)
                .orElseThrow(() -> new IllegalArgumentException("QR code not found."));
    }
}