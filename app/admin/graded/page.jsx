import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import DeleteButton from "@/components/admin/DeleteButton";
import { deleteGraded } from "@/lib/actions/singles";

export const metadata = { title: "Graded Cards" };

export default async function AdminGradedPage() {
  const supabase = await createClient();
  const { data: cardsRaw } = await supabase
    .from("graded_cards")
    .select("*")
    .order("created_at", { ascending: false });
  const cards = cardsRaw ?? [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl text-white tracking-wide">Graded Cards</h1>
          <p className="text-muted font-mono text-xs mt-1">{cards.length} slabs in inventory</p>
        </div>
        <Link href="/admin/graded/new" className="btn-neon">+ Add Graded Card</Link>
      </div>

      <div className="glass overflow-x-auto">
        <table className="w-full min-w-[700px]">
          <thead>
            <tr className="border-b border-border">
              {["Card", "Set", "Grader", "Grade", "Cert #", "Lang", "Price", "Stock", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-mono text-xs text-muted uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {cards.length === 0 ? (
              <tr>
                <td colSpan={9} className="px-4 py-10 text-center text-muted font-mono text-sm">
                  No graded cards yet.{" "}
                  <Link href="/admin/graded/new" className="text-neon hover:underline">Add your first slab →</Link>
                </td>
              </tr>
            ) : (
              cards.map((c) => (
                <tr key={c.id} className={`hover:bg-surface-2/40 transition-colors ${!c.in_stock ? "opacity-50" : ""}`}>
                  <td className="px-4 py-3 font-body font-medium text-white text-sm">{c.pokemon_name}</td>
                  <td className="px-4 py-3 text-sm text-subtle">{c.set_name}</td>
                  <td className="px-4 py-3"><span className="badge badge-gold">{c.grader}</span></td>
                  <td className="px-4 py-3 font-display text-xl text-gold">{c.grade}</td>
                  <td className="px-4 py-3 font-mono text-xs text-muted">{c.cert_number ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-xs capitalize text-subtle">{c.language}</td>
                  <td className="px-4 py-3 font-body font-semibold text-white">${Number(c.price).toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <span className={`badge ${c.in_stock ? "badge-green" : "badge-red"}`}>
                      {c.in_stock ? "In Stock" : "Sold"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Link href={`/admin/graded/${c.id}/edit`} className="font-mono text-xs text-neon hover:underline">Edit</Link>
                      <DeleteButton id={c.id} action={deleteGraded} />
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
