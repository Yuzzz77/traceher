import {
  BatchStatus,
  PrismaClient,
  QrStatus,
  ReportStatus,
  ResultLevel
} from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.inspectionResult.deleteMany();
  await prisma.inspectionReport.deleteMany();
  await prisma.batchMaterialRel.deleteMany();
  await prisma.qrCode.deleteMany();
  await prisma.rawMaterialBatch.deleteMany();
  await prisma.productBatch.deleteMany();

  const activeProductBatch = await prisma.productBatch.create({
    data: {
      batchNo: "TH202605001",
      productName: "TraceHer Ultra Soft",
      productionDate: new Date("2026-05-20T00:00:00.000Z"),
      status: BatchStatus.VERIFIED
    }
  });

  const activeCotton = await prisma.rawMaterialBatch.create({
    data: {
      batchNo: "RM-COTTON-20260501",
      materialName: "Cotton Fiber",
      materialType: "COTTON"
    }
  });

  const activeSAP = await prisma.rawMaterialBatch.create({
    data: {
      batchNo: "RM-SAP-20260502",
      materialName: "Super Absorbent Polymer",
      materialType: "SAP"
    }
  });

  await prisma.batchMaterialRel.createMany({
    data: [
      {
        productBatchId: activeProductBatch.id,
        rawMaterialBatchId: activeCotton.id,
        usageRatio: "68.00"
      },
      {
        productBatchId: activeProductBatch.id,
        rawMaterialBatchId: activeSAP.id,
        usageRatio: "12.00"
      }
    ]
  });

  const activeReport = await prisma.inspectionReport.create({
    data: {
      reportNo: "RPT-20260520-001",
      productBatchId: activeProductBatch.id,
      reportStatus: ReportStatus.APPROVED,
      inspectedAt: new Date("2026-05-21T00:00:00.000Z"),
      inspectionResults: {
        create: [
          {
            itemName: "Fluorescent Agent",
            resultValue: "Not Detected",
            resultLevel: ResultLevel.PASS,
            standardRange: "Not Detected"
          },
          {
            itemName: "Formaldehyde",
            resultValue: "Not Detected",
            resultLevel: ResultLevel.PASS,
            standardRange: "< 20 mg/kg"
          }
        ]
      }
    }
  });

  await prisma.qrCode.create({
    data: {
      code: "TH202605001-QR-7F3A",
      productBatchId: activeProductBatch.id,
      status: QrStatus.ACTIVE,
      activatedAt: new Date("2026-05-21T00:00:00.000Z"),
      scanCount: 12,
      firstScannedAt: new Date("2026-05-22T00:00:00.000Z")
    }
  });

  const inactiveProductBatch = await prisma.productBatch.create({
    data: {
      batchNo: "TH202605002",
      productName: "TraceHer Daily Fresh",
      productionDate: new Date("2026-05-22T00:00:00.000Z"),
      status: BatchStatus.UNVERIFIED
    }
  });

  await prisma.rawMaterialBatch.create({
    data: {
      batchNo: "RM-NONWOVEN-20260503",
      materialName: "Nonwoven Fabric",
      materialType: "NONWOVEN"
    }
  });

  await prisma.qrCode.create({
    data: {
      code: "TH202605002-QR-1C8B",
      productBatchId: inactiveProductBatch.id,
      status: QrStatus.INACTIVE,
      scanCount: 0
    }
  });

  const frozenProductBatch = await prisma.productBatch.create({
    data: {
      batchNo: "TH202605003",
      productName: "TraceHer Night Guard",
      productionDate: new Date("2026-05-23T00:00:00.000Z"),
      status: BatchStatus.RISK
    }
  });

  const frozenMaterial = await prisma.rawMaterialBatch.create({
    data: {
      batchNo: "RM-ADHESIVE-20260504",
      materialName: "Hot Melt Adhesive",
      materialType: "ADHESIVE"
    }
  });

  await prisma.batchMaterialRel.create({
    data: {
      productBatchId: frozenProductBatch.id,
      rawMaterialBatchId: frozenMaterial.id,
      usageRatio: "8.00"
    }
  });

  await prisma.inspectionReport.create({
    data: {
      reportNo: "RPT-20260523-001",
      productBatchId: frozenProductBatch.id,
      reportStatus: ReportStatus.REJECTED,
      inspectedAt: new Date("2026-05-24T00:00:00.000Z"),
      inspectionResults: {
        create: [
          {
            itemName: "Fluorescent Agent",
            resultValue: "Detected",
            resultLevel: ResultLevel.FAIL,
            standardRange: "Not Detected"
          }
        ]
      }
    }
  });

  await prisma.qrCode.create({
    data: {
      code: "TH202605003-QR-9D2E",
      productBatchId: frozenProductBatch.id,
      status: QrStatus.FROZEN,
      activatedAt: new Date("2026-05-24T00:00:00.000Z"),
      scanCount: 31,
      firstScannedAt: new Date("2026-05-24T00:30:00.000Z")
    }
  });

  console.log("Seed completed.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
