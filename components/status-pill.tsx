type StatusPillProps = {
  status: "ACTIVE" | "INACTIVE" | "FROZEN";
};

export function StatusPill({ status }: StatusPillProps) {
  return <span className={`status-pill status-${status.toLowerCase()}`}>{status}</span>;
}
