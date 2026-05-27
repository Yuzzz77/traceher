package com.traceher.traceher.service.impl;

import com.traceher.traceher.entity.Supplier;
import com.traceher.traceher.repository.SupplierRepository;
import com.traceher.traceher.service.SupplierService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SupplierServiceImpl implements SupplierService {

    private static final String DEFAULT_RISK_LEVEL = "NORMAL";
    private static final String DEFAULT_AUDIT_STATUS = "PENDING";
    private static final int NOT_DELETED = 0;

    private final SupplierRepository supplierRepository;

    public SupplierServiceImpl(SupplierRepository supplierRepository) {
        this.supplierRepository = supplierRepository;
    }

    @Override
    @Transactional
    public Supplier addSupplier(Supplier supplier) {
        if (supplier == null) {
            throw new IllegalArgumentException("Supplier must not be null.");
        }

        if (isBlank(supplier.getRiskLevel())) {
            supplier.setRiskLevel(DEFAULT_RISK_LEVEL);
        }
        if (isBlank(supplier.getAuditStatus())) {
            supplier.setAuditStatus(DEFAULT_AUDIT_STATUS);
        }
        supplier.setIsDeleted(NOT_DELETED);

        return supplierRepository.save(supplier);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Supplier> searchByCompanyName(String companyName) {
        return supplierRepository.findByCompanyNameContaining(companyName == null ? "" : companyName);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Supplier> findByAuditStatusAndRiskLevel(String auditStatus, String riskLevel) {
        return supplierRepository.findByAuditStatusAndRiskLevel(auditStatus, riskLevel);
    }

    @Override
    @Transactional
    public Supplier auditSupplier(Long supplierId, String auditStatus) {
        Supplier supplier = supplierRepository.findById(supplierId)
                .filter(item -> item.getIsDeleted() != null && item.getIsDeleted() == NOT_DELETED)
                .orElseThrow(() -> new IllegalArgumentException("Supplier not found."));

        supplier.setAuditStatus(auditStatus);
        return supplierRepository.save(supplier);
    }

    private boolean isBlank(String value) {
        return value == null || value.isBlank();
    }
}