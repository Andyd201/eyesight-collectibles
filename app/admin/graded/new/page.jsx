import GradedForm from "@/components/admin/GradedForm";
export const metadata = { title: "Add Graded Card" };

export default function NewGradedPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-white tracking-wide">Add Graded Card</h1>
        <p className="text-muted font-mono text-xs mt-1">Add a PSA, CGC, or Beckett slabbed card</p>
      </div>
      <GradedForm />
    </div>
  );
}
