import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import StockInput   from "@/components/admin/StockInput";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteSingle } from "@/lib/actions/singles";

export const metadata = { title: "Singles" };

export default async function AdminSinglesPage() {
  const supabase = await createClient();
  const { data: singlesRaw } = await supabase
    .from("singles")
    .select("*")
    .order("created_at", { ascending: false });
  const singles = singlesRaw ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl text-white tracking-wide">Singles</h1>
          <p className="text-muted font-mono text-xs mt-1">{singles.length} cards in inventory</p>
        </div>
        <Link href="/admin/singles/new" className="btn-neon">+ Add Single</Link>
      </div>

      <div className="glass overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead>
            <tr className="border-b border-border">
              {["Pokémon", "Set", "Rarity", "Lang", "Cond", "Price", "Stock", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-mono text-xs text-muted uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {singles.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-10 text-center text-muted font-mono text-sm">
                  No singles yet.{" "}
                  <Link href="/admin/singles/new" className="text-neon hover:underline">Add your first card →</Link>
                </td>
              </tr>
            ) : (
              singles.map((s) => (
                <tr key={s.id} className="hover:bg-surface-2/40 transition-colors">
                  <td className="px-4 py-3">
                    <p className="font-body font-medium text-white text-sm">{s.pokemon_name}</p>
                    {s.card_number && <p className="font-mono text-[10px] text-muted">#{s.card_number}</p>}
                  </td>
                  <td className="px-4 py-3 text-sm text-subtle">
                    <p>{s.set_name}</p>
                    {s.set_code && <p className="font-mono text-[10px] text-muted">{s.set_code}</p>}
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-subtle max-w-[140px] truncate">{s.rarity ?? "—"}</td>
                  <td className="px-4 py-3"><span className="badge badge-cyan capitalize">{s.language}</span></td>
                  <td className="px-4 py-3"><span className="badge badge-green uppercase">{s.condition?.replace(/_/g, " ")}</span></td>
                  <td className="px-4 py-3 font-body font-semibold text-white text-sm">${Number(s.price).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <StockInput id={s.id} initialStock={s.stock} type="single" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/singles/${s.id}/edit`} className="font-mono text-xs text-neon hover:underline">Edit</Link>
                      <DeleteButton id={s.id} action={deleteSingle} />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
