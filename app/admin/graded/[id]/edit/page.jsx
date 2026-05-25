import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import GradedForm from "@/components/admin/GradedForm";

export const metadata = { title: "Edit Graded Card" };

export default async function EditGradedPage({ params }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: card } = await supabase.from("graded_cards").select("*").eq("id", id).single();
  if (!card) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-white tracking-wide">Edit Graded Card</h1>
        <p className="text-muted font-mono text-xs mt-1">
          {card.grader} {card.grade} — {card.pokemon_name}
        </p>
      </div>
      <GradedForm card={card} />
    </div>
  );
}
