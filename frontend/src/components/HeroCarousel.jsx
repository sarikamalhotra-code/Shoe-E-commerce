import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function HeroCarousel({ slides }) {
  const [index, setIndex] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  const go = (i) => {
    clearInterval(timerRef.current);
    setIndex((i + slides.length) % slides.length);
    timerRef.current = setInterval(() => setIndex((x) => (x + 1) % slides.length), 5000);
  };

  const slide = slides[index];

  return (
    <section className="relative bg-track text-white overflow-hidden">
      <div className="container-x grid lg:grid-cols-2 gap-8 py-12 lg:py-20 items-center relative z-10 min-h-[440px] lg:min-h-[520px]">
        <div key={index} className="animate-[fadein_0.5s_ease]">
          <p className="inline-block bg-traction text-white text-xs font-bold uppercase tracking-wide px-3 py-1.5 rounded-full mb-5">{slide.eyebrow}</p>
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl lg:text-6xl leading-[1.05]">{slide.title}</h1>
          <p className="mt-5 text-white/70 max-w-md text-base sm:text-lg">{slide.subtitle}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link to={slide.ctaLink} className="btn-primary">{slide.cta}</Link>
            <Link to="/shop?sort=discount" className="btn-outline-white">See Trends</Link>
          </div>
        </div>
        <div className="relative flex justify-center lg:justify-end">
          <div className="absolute w-64 h-64 sm:w-80 sm:h-80 bg-traction/25 rounded-full blur-2xl" />
          <img
            key={slide.image}
            src={slide.image}
            alt={slide.title}
            className="relative w-full max-w-md aspect-square object-cover rounded-3xl shadow-2xl animate-[fadein_0.6s_ease]"
          />
        </div>
      </div>

      {/* dots */}
      <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => go(i)}
            aria-label={`Go to slide ${i + 1}`}
            aria-current={i === index}
            className={`h-2 rounded-full transition-all ${i === index ? "w-7 bg-traction" : "w-2 bg-white/40 hover:bg-white/60"}`}
          />
        ))}
      </div>

      {/* arrows */}
      <button onClick={() => go(index - 1)} aria-label="Previous slide" className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center z-10 transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M15 18l-6-6 6-6" /></svg>
      </button>
      <button onClick={() => go(index + 1)} aria-label="Next slide" className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 items-center justify-center z-10 transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2"><path d="M9 18l6-6-6-6" /></svg>
      </button>
    </section>
  );
}
