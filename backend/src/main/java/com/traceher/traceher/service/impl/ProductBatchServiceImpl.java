package com.traceher.traceher.service.impl;

import com.traceher.traceher.entity.ProductBatch;
import com.traceher.traceher.repository.ProductBatchRepository;
import com.traceher.traceher.service.ProductBatchService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.UUID;

@Service
public class ProductBatchServiceImpl implements ProductBatchService {

    private static final String DEFAULT_BATCH_STATUS = "UNVERIFIED";
    private static final String DEFAULT_AUDIT_STATUS = "PENDING";
    private static final int NOT_DELETED = 0;
    private static final DateTimeFormatter BATCH_DATE_FORMATTER = DateTimeFormatter.BASIC_ISO_DATE;

    private final ProductBatchRepository productBatchRepository;

    public ProductBatchServiceImpl(ProductBatchRepository productBatchRepository) {
        this.productBatchRepository = productBatchRepository;
    }

    @Override
    @Transactional
    public ProductBatch createProductBatch(ProductBatch productBatch) {
        productBatch.setBatchNumber(generateBatchNumber());
        productBatch.setBatchStatus(DEFAULT_BATCH_STATUS);
        productBatch.setAuditStatus(DEFAULT_AUDIT_STATUS);
        productBatch.setIsDeleted(NOT_DELETED);
        return productBatchRepository.save(productBatch);
    }

    @Override
    @Transactional(readOnly = true)
    public ProductBatch getByBatchNumber(String batchNumber) {
        return productBatchRepository.findByBatchNumber(batchNumber)
                .orElseThrow(() -> new IllegalArgumentException("Product batch not found."));
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProductBatch> findByBatchStatus(String batchStatus) {
        return productBatchRepository.findByBatchStatus(batchStatus);
    }

    private String generateBatchNumber() {
        String datePart = LocalDate.now().format(BATCH_DATE_FORMATTER);
        String randomPart = UUID.randomUUID().toString().replace("-", "").substring(0, 12).toUpperCase();
        return "BATCH-" + datePart + "-" + randomPart;
    }
}