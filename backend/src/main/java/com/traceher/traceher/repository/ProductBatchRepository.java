package com.traceher.traceher.repository;

import com.traceher.traceher.entity.ProductBatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProductBatchRepository extends JpaRepository<ProductBatch, Long> {

    /**
     * Query active product batch by unique batch number.
     */
    @Query("select p from ProductBatch p where p.isDeleted = 0 and p.batchNumber = :batchNumber")
    Optional<ProductBatch> findByBatchNumber(@Param("batchNumber") String batchNumber);

    /**
     * Query active product batches by batch status.
     */
    @Query("select p from ProductBatch p where p.isDeleted = 0 and p.batchStatus = :batchStatus")
    List<ProductBatch> findByBatchStatus(@Param("batchStatus") String batchStatus);
}