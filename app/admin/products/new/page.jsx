import ProductForm from "@/components/admin/ProductForm";
export const metadata = { title: "Add Product" };
export default function NewProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-white tracking-wide">Add Product</h1>
        <p className="text-muted font-mono text-xs mt-1">Add a new sealed product, single, accessory, or merchandise item</p>
      </div>
      <ProductForm />
    </div>
  );
}
