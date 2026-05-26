package com.traceher.traceher.service;

import com.traceher.traceher.entity.Supplier;

import java.util.List;

public interface SupplierService {

    Supplier addSupplier(Supplier supplier);

    List<Supplier> searchByCompanyName(String companyName);

    List<Supplier> findByAuditStatusAndRiskLevel(String auditStatus, String riskLevel);

    Supplier auditSupplier(Long supplierId, String auditStatus);
}