package com.traceher.traceher.controller;

import com.traceher.traceher.entity.ProductBatch;
import com.traceher.traceher.service.ProductBatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/batches")
public class ProductBatchController {

    private final ProductBatchService productBatchService;

    public ProductBatchController(ProductBatchService productBatchService) {
        this.productBatchService = productBatchService;
    }

    @PostMapping
    public ResponseEntity<?> createProductBatch(@RequestBody ProductBatch productBatch) {
        try {
            return ResponseEntity.ok(productBatchService.createProductBatch(productBatch));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/{batchNumber}")
    public ResponseEntity<?> getByBatchNumber(@PathVariable String batchNumber) {
        try {
            return ResponseEntity.ok(productBatchService.getByBatchNumber(batchNumber));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/status")
    public ResponseEntity<?> findByBatchStatus(@RequestParam String batchStatus) {
        try {
            return ResponseEntity.ok(productBatchService.findByBatchStatus(batchStatus));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}