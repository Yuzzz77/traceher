"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";

export function VerifySearchForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const canSubmit = useMemo(() => code.trim().length > 0, [code]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const value = code.trim();

    if (!value) {
      return;
    }

    router.push(`/verify/${encodeURIComponent(value)}`);
  }

  return (
    <form className="search-form" onSubmit={handleSubmit}>
      <input
        aria-label="QR code"
        className="search-input"
        placeholder="Enter QR code"
        value={code}
        onChange={(event) => setCode(event.target.value)}
      />
      <button className="search-button" type="submit" disabled={!canSubmit}>
        <Search size={16} />
        Search
      </button>
    </form>
  );
}
