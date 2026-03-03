import { useEffect, useRef } from "react";

export default function Particles() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    for (let i = 0; i < 12; i++) {
      const p = document.createElement("div");
      p.className = "particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.bottom = Math.random() * 30 + "%";
      p.style.animationDelay = Math.random() * 6 + "s";
      p.style.animationDuration = 4 + Math.random() * 4 + "s";
      container.appendChild(p);
    }
    return () => { container.innerHTML = ""; };
  }, []);

  return <div ref={ref} className="particles" />;
}
