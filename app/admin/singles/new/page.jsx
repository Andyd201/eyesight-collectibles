import SingleForm from "@/components/admin/SingleForm";
export const metadata = { title: "Add Single" };

export default function NewSinglePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-white tracking-wide">Add Single</h1>
        <p className="text-muted font-mono text-xs mt-1">Add an individual card to your inventory</p>
      </div>
      <SingleForm />
    </div>
  );
}
