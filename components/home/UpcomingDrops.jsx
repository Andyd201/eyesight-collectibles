"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { UPCOMING_DROPS } from "@/lib/mockData";

function getTimeLeft(dateStr) {
  const diff = new Date(dateStr) - new Date();
  if (diff <= 0) return null;
  return {
    days:  Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
  };
}

function Countdown({ dateStr }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    setTimeLeft(getTimeLeft(dateStr));
    const id = setInterval(() => setTimeLeft(getTimeLeft(dateStr)), 60_000);
    return () => clearInterval(id);
  }, [dateStr]);

  // Render nothing on the server (avoids hydration mismatch)
  if (timeLeft === null) return <span className="font-mono text-xs text-green-400">Available now</span>;

  return (
    <div className="flex items-center gap-2 font-mono text-xs">
      <span className="px-2 py-1 rounded bg-surface-3 text-white">{timeLeft.days}d</span>
      <span className="text-muted">:</span>
      <span className="px-2 py-1 rounded bg-surface-3 text-white">{timeLeft.hours}h</span>
    </div>
  );
}

export default function UpcomingDrops() {
  return (
    <section className="py-20 px-4 sm:px-6 max-w-7xl mx-auto">
      <div className="flex items-end justify-between mb-10">
        <div>
          <p className="section-label">🗓️ Mark your calendar</p>
          <h2 className="section-title">Upcoming Drops</h2>
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-6">
        {UPCOMING_DROPS.map((drop) => (
          <div key={drop.id} className="relative glass-hover p-6 overflow-hidden group">
            {/* Glow accent */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-neon to-transparent opacity-60" />

            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-surface-3 flex items-center justify-center text-3xl shrink-0">
                📦
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-body font-semibold text-white leading-snug group-hover:text-neon transition-colors">
                  {drop.name}
                </h3>
                <p className="font-mono text-xs text-muted mt-1">
                  {new Date(drop.releaseDate).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <div>
                <p className="font-mono text-xs text-muted mb-1">Releases in</p>
                <Countdown dateStr={drop.releaseDate} />
              </div>
              <div className="text-right">
                <p className="font-body font-bold text-white">${drop.price.toFixed(2)}</p>
                {drop.preorder && (
                  <Link href={`/product/${drop.id}`} className="btn-gold text-xs py-1.5 px-3 mt-1 inline-block">
                    Pre-order
                  </Link>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
