export default function Rating({ value = 0, count, size = "sm" }) {
  const full = Math.round(value);
  const dim = size === "sm" ? "text-xs" : "text-base";
  return (
    <span className={`inline-flex items-center gap-1 ${dim}`}>
      <span className="text-star" aria-hidden="true">
        {"★".repeat(full)}
        <span className="text-haze">{"★".repeat(5 - full)}</span>
      </span>
      {count != null && <span className="text-graphite">({count})</span>}
    </span>
  );
}
