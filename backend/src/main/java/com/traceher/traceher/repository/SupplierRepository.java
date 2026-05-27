package com.traceher.traceher.repository;

import com.traceher.traceher.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {

    /**
     * Query active suppliers by company name.
     */
    @Query("select s from Supplier s where s.isDeleted = 0 and s.companyName like concat('%', :companyName, '%')")
    List<Supplier> findByCompanyNameContaining(@Param("companyName") String companyName);

    /**
     * Query active suppliers by audit status and risk level.
     */
    @Query("select s from Supplier s where s.isDeleted = 0 and s.auditStatus = :auditStatus and s.riskLevel = :riskLevel")
    List<Supplier> findByAuditStatusAndRiskLevel(
            @Param("auditStatus") String auditStatus,
            @Param("riskLevel") String riskLevel
    );
}