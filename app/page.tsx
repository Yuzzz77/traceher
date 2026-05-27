import { VerifySearchForm } from "@/components/verify-search-form";

export default function HomePage() {
  return (
    <main className="page-shell">
      <section className="page-header">
        <p className="eyebrow">TraceHer</p>
        <h1>QR verification</h1>
        <p className="lede">
          Check a QR code, load the batch record, and view the latest inspection
          results from the database.
        </p>
      </section>

      <section className="panel">
        <h2>Verify a code</h2>
        <p className="panel-copy">
          Enter the QR code printed on the package to open the verification
          result page.
        </p>
        <VerifySearchForm />
      </section>
    </main>
  );
}
