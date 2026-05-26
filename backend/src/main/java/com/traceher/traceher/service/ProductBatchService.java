package com.traceher.traceher.service;

import com.traceher.traceher.entity.ProductBatch;

import java.util.List;

public interface ProductBatchService {

    ProductBatch createProductBatch(ProductBatch productBatch);

    ProductBatch getByBatchNumber(String batchNumber);

    List<ProductBatch> findByBatchStatus(String batchStatus);
}