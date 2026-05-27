import { StatusPill } from "@/components/status-pill";
import { getVerificationByCode } from "@/lib/verification";
import Link from "next/link";

export const dynamic = "force-dynamic";

type PageProps = {
  params: {
    code: string;
  };
};

function formatDate(value: string | null) {
  if (!value) {
    return "-";
  }

  return value;
}

export default async function VerificationPage({ params }: PageProps) {
  const record = await getVerificationByCode(params.code);

  if (!record) {
    return (
      <main className="page-shell">
        <section className="panel">
          <p className="eyebrow">Verification result</p>
          <h1>Code not found</h1>
          <p className="panel-copy">
            No QR record matched <strong>{params.code}</strong>.
          </p>
          <Link className="link-button" href="/">
            Back to search
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="page-header">
        <p className="eyebrow">Verification result</p>
        <h1>{record.product_name}</h1>
        <p className="lede">QR code {params.code}</p>
      </section>

      <section className="panel result-grid">
        <div className="result-summary">
          <div>
            <span className="label">Risk status</span>
            <StatusPill status={record.qr_status} />
          </div>

          <div className="detail-grid">
            <div>
              <span className="label">Batch number</span>
              <strong>{record.batch_no}</strong>
            </div>
            <div>
              <span className="label">Production date</span>
              <strong>{formatDate(record.production_date)}</strong>
            </div>
            <div>
              <span className="label">Batch status</span>
              <strong>{record.batch_status}</strong>
            </div>
            <div>
              <span className="label">Report status</span>
              <strong>{record.report_status ?? "-"}</strong>
            </div>
          </div>

          {record.raw_materials.length > 0 ? (
            <div className="subsection">
              <h2>Raw materials</h2>
              <ul className="list">
                {record.raw_materials.map((item) => (
                  <li key={item.batch_no} className="list-item">
                    <div>
                      <strong>{item.material_name}</strong>
                      <p>
                        {item.batch_no} - {item.material_type}
                      </p>
                    </div>
                    <span>{item.usage_ratio}%</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>

        <div className="subsection">
          <h2>Inspection results</h2>
          {record.safety_results.length > 0 ? (
            <ul className="list">
              {record.safety_results.map((item) => (
                <li key={`${item.item_name}-${item.result_value}`} className="list-item">
                  <div>
                    <strong>{item.item_name}</strong>
                    <p>{item.standard_range}</p>
                  </div>
                  <div className={`result-level level-${item.result_level.toLowerCase()}`}>
                    {item.result_value}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="empty-state">No approved inspection result is available yet.</p>
          )}
        </div>
      </section>
    </main>
  );
}
