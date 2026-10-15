// Numbered markers are appropriate here: checkout is a real, ordered sequence.
export default function StepIndicator({ steps, current }) {
  return (
    <ol className="flex items-center w-full mb-10">
      {steps.map((s, i) => {
        const idx = i + 1;
        const state = idx < current ? "done" : idx === current ? "active" : "todo";
        return (
          <li key={s} className="flex-1 flex items-center last:flex-none">
            <div className="flex items-center gap-2.5">
              <span
                className={`h-8 w-8 shrink-0 flex items-center justify-center font-display font-bold text-sm border-2 ${
                  state === "todo" ? "border-ink/20 text-ink/40" : "border-ink bg-ink text-white"
                }`}
              >
                {state === "done" ? "✓" : idx}
              </span>
              <span className={`hidden sm:inline text-sm font-medium ${state === "todo" ? "text-ink/40" : "text-ink"}`}>{s}</span>
            </div>
            {idx !== steps.length && <div className={`h-0.5 flex-1 mx-3 ${state === "done" ? "bg-ink" : "bg-ink/15"}`} />}
          </li>
        );
      })}
    </ol>
  );
}
