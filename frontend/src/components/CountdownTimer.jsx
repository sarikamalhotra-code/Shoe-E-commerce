import { useEffect, useState } from "react";

function getRemaining(target) {
  const diff = Math.max(0, target - Date.now());
  return {
    d: Math.floor(diff / 86400000),
    h: Math.floor((diff / 3600000) % 24),
    m: Math.floor((diff / 60000) % 60),
    s: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer({ hours = 26, dark = false }) {
  const [target] = useState(() => Date.now() + hours * 3600 * 1000);
  const [time, setTime] = useState(() => getRemaining(target));

  useEffect(() => {
    const id = setInterval(() => setTime(getRemaining(target)), 1000);
    return () => clearInterval(id);
  }, [target]);

  const units = [
    { v: time.d, l: "Days" },
    { v: time.h, l: "Hrs" },
    { v: time.m, l: "Min" },
    { v: time.s, l: "Sec" },
  ];

  return (
    <div className="flex gap-2.5" role="timer" aria-live="off">
      {units.map((u) => (
        <div key={u.l} className={`w-14 sm:w-16 text-center rounded-lg py-2 ${dark ? "bg-white/10" : "bg-haze"}`}>
          <p className="font-display font-bold text-xl sm:text-2xl tabular-nums">{String(u.v).padStart(2, "0")}</p>
          <p className={`text-[10px] uppercase tracking-wide ${dark ? "text-white/60" : "text-graphite"}`}>{u.l}</p>
        </div>
      ))}
    </div>
  );
}
