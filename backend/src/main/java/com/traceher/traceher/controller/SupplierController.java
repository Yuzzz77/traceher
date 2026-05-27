package com.traceher.traceher.controller;

import com.traceher.traceher.entity.Supplier;
import com.traceher.traceher.service.SupplierService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/suppliers")
public class SupplierController {

    private final SupplierService supplierService;

    public SupplierController(SupplierService supplierService) {
        this.supplierService = supplierService;
    }

    @PostMapping
    public ResponseEntity<?> addSupplier(@RequestBody Supplier supplier) {
        try {
            return ResponseEntity.ok(supplierService.addSupplier(supplier));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/search")
    public ResponseEntity<?> searchByCompanyName(@RequestParam String companyName) {
        try {
            return ResponseEntity.ok(supplierService.searchByCompanyName(companyName));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping("/filter")
    public ResponseEntity<?> filterSuppliers(@RequestParam String auditStatus,
                                             @RequestParam String riskLevel) {
        try {
            return ResponseEntity.ok(supplierService.findByAuditStatusAndRiskLevel(auditStatus, riskLevel));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping("/{id}/audit")
    public ResponseEntity<?> auditSupplier(@PathVariable Long id,
                                           @RequestParam String auditStatus) {
        try {
            return ResponseEntity.ok(supplierService.auditSupplier(id, auditStatus));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}