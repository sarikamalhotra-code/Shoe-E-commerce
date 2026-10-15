export default function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="flex items-end justify-between mb-6 gap-4">
      <div>
        {eyebrow && <p className="label-eyebrow mb-1.5">{eyebrow}</p>}
        <h2 className="font-display text-3xl sm:text-4xl">{title}</h2>
      </div>
      {action}
    </div>
  );
}
