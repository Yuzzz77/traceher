import { prisma } from "@/lib/prisma";
import { BatchStatus, QrStatus, ReportStatus, ResultLevel } from "@prisma/client";

type VerificationResult = {
  item_name: string;
  result_value: string;
  result_level: ResultLevel;
  standard_range: string;
};

type VerificationMaterial = {
  batch_no: string;
  material_name: string;
  material_type: string;
  usage_ratio: string;
};

export type VerificationResponse = {
  product_name: string;
  batch_no: string;
  production_date: string;
  qr_status: QrStatus;
  batch_status: BatchStatus;
  report_status: ReportStatus | null;
  safety_results: VerificationResult[];
  raw_materials: VerificationMaterial[];
};

function formatDate(value: Date) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "UTC"
  }).format(value);
}

export async function getVerificationByCode(
  code: string
): Promise<VerificationResponse | null> {
  const qrCode = await prisma.qrCode.findUnique({
    where: {
      code
    },
    include: {
      productBatch: {
        include: {
          batchMaterials: {
            include: {
              rawMaterialBatch: true
            },
            orderBy: {
              id: "asc"
            }
          },
          inspectionReports: {
            orderBy: {
              inspectedAt: "desc"
            },
            take: 1,
            include: {
              inspectionResults: {
                orderBy: {
                  id: "asc"
                }
              }
            }
          }
        }
      }
    }
  });

  if (!qrCode) {
    return null;
  }

  const latestReport = qrCode.productBatch.inspectionReports[0] ?? null;

  return {
    product_name: qrCode.productBatch.productName,
    batch_no: qrCode.productBatch.batchNo,
    production_date: formatDate(qrCode.productBatch.productionDate),
    qr_status: qrCode.status,
    batch_status: qrCode.productBatch.status,
    report_status: latestReport?.reportStatus ?? null,
    safety_results:
      latestReport?.reportStatus === ReportStatus.APPROVED
        ? latestReport.inspectionResults.map((item) => ({
            item_name: item.itemName,
            result_value: item.resultValue,
            result_level: item.resultLevel,
            standard_range: item.standardRange
          }))
        : [],
    raw_materials: qrCode.productBatch.batchMaterials.map((item) => ({
      batch_no: item.rawMaterialBatch.batchNo,
      material_name: item.rawMaterialBatch.materialName,
      material_type: item.rawMaterialBatch.materialType,
      usage_ratio: item.usageRatio.toString()
    }))
  };
}
