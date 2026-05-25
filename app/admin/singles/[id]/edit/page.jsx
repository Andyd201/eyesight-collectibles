import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SingleForm from "@/components/admin/SingleForm";

export const metadata = { title: "Edit Single" };

export default async function EditSinglePage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: single } = await supabase.from("singles").select("*").eq("id", id).single();
  if (!single) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-white tracking-wide">Edit Single</h1>
        <p className="text-muted font-mono text-xs mt-1 truncate">
          {single.pokemon_name} — {single.set_name}
        </p>
      </div>
      <SingleForm single={single} />
    </div>
  );
}
