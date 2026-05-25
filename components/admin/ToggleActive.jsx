"use client";

import { useState, useTransition } from "react";
import { toggleProductActive } from "@/lib/actions/products";

export default function ToggleActive({ id, initialActive }) {
  const [active,    setActive]    = useState(initialActive);
  const [isPending, startTransition] = useTransition();

  function toggle() {
    startTransition(async () => {
      const result = await toggleProductActive(id, !active);
      if (!result?.error) setActive(!active);
    });
  }

  return (
    <button
      onClick={toggle}
      disabled={isPending}
      className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors disabled:opacity-40 ${
        active ? "bg-neon" : "bg-surface-3 border border-border"
      }`}
      aria-label={active ? "Deactivate" : "Activate"}
    >
      <span
        className={`inline-block h-3.5 w-3.5 rounded-full bg-white shadow transition-transform ${
          active ? "translate-x-4.5" : "translate-x-0.5"
        }`}
        style={{ transform: active ? "translateX(18px)" : "translateX(2px)" }}
      />
    </button>
  );
}
