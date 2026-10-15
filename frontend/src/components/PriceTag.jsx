const fmt = (n) => `₹${n.toLocaleString("en-IN")}`;

export default function PriceTag({ price, mrp, size = "base" }) {
  const hasDiscount = mrp && mrp > price;
  const priceCls = size === "lg" ? "text-2xl" : "text-base";
  return (
    <span className="inline-flex items-baseline gap-2">
      <span className={`font-bold text-ink ${priceCls}`}>{fmt(price)}</span>
      {hasDiscount && <span className="text-graphite line-through text-sm">{fmt(mrp)}</span>}
    </span>
  );
}
