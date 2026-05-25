"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/lib/actions/products";

const FIELD = ({ label, name, type = "text", placeholder, defaultValue, required, children, hint }) => (
  <div>
    <label className="font-mono text-xs text-neon uppercase tracking-wider block mb-1">
      {label}{required && <span className="text-red-400 ml-1">*</span>}
    </label>
    {children ?? (
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        defaultValue={defaultValue ?? ""}
        required={required}
        step={type === "number" ? "0.01" : undefined}
        className="w-full bg-surface-3 border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-neon/50"
      />
    )}
    {hint && <p className="font-mono text-[10px] text-muted mt-1">{hint}</p>}
  </div>
);

const SELECT = ({ label, name, options, defaultValue, required }) => (
  <FIELD label={label} required={required}>
    <select name={name} defaultValue={defaultValue ?? options[0].value}
      className="w-full bg-surface-3 border border-border rounded-lg px-4 py-2.5 text-sm text-white focus:outline-none focus:border-neon/50">
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </FIELD>
);

export default function ProductForm({ product }) {
  const router = useRouter();
  const [error, setError] = useState(null);
  const [isPending, startTransition] = useTransition();
  const isEdit = !!product;

  function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      try {
        const result = isEdit
          ? await updateProduct(product.id, formData)
          : await createProduct(formData);

        if (result?.error) { setError(result.error); return; }
        router.push("/admin/products");
      } catch (err) {
        setError(err?.message ?? "Something went wrong. Check console for details.");
        console.error("[ProductForm error]", err);
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="glass p-6 space-y-5">
        <h2 className="font-display text-xl text-white tracking-wide">Basic Info</h2>
        <FIELD label="Product Name" name="name" placeholder="Scarlet & Violet Booster Box" defaultValue={product?.name} required />
        <FIELD label="Description" name="description" defaultValue={product?.description}>
          <textarea name="description" rows={3} defaultValue={product?.description ?? ""}
            placeholder="Describe this product..."
            className="w-full bg-surface-3 border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-neon/50 resize-none" />
        </FIELD>
        <div className="grid grid-cols-2 gap-4">
          <SELECT label="Category" name="category" defaultValue={product?.category} required options={[
            { value: "sealed",      label: "Sealed Product" },
            { value: "single",      label: "Single Card"    },
            { value: "graded",      label: "Graded Card"    },
            { value: "accessory",   label: "Accessory"      },
            { value: "merchandise", label: "Merchandise"    },
          ]} />
          <FIELD label="Subcategory" name="subcategory" placeholder="booster-box, etb, tin..." defaultValue={product?.subcategory} />
        </div>
      </div>

      <div className="glass p-6 space-y-5">
        <h2 className="font-display text-xl text-white tracking-wide">Set & Language</h2>
        <div className="grid grid-cols-2 gap-4">
          <FIELD label="Set Name" name="set_name" placeholder="Scarlet & Violet" defaultValue={product?.set_name} />
          <FIELD label="Set Code" name="set_code" placeholder="SV1" defaultValue={product?.set_code} />
        </div>
        <SELECT label="Language" name="language" defaultValue={product?.language ?? "english"} options={[
          { value: "english",  label: "English"  },
          { value: "japanese", label: "Japanese" },
          { value: "korean",   label: "Korean"   },
          { value: "chinese",  label: "Chinese"  },
          { value: "other",    label: "Other"    },
        ]} />
      </div>

      <div className="glass p-6 space-y-5">
        <h2 className="font-display text-xl text-white tracking-wide">Pricing & Stock</h2>
        <div className="grid grid-cols-3 gap-4">
          <FIELD label="Price ($)" name="price" type="number" placeholder="0.00" defaultValue={product?.price} required />
          <FIELD label="Original Price ($)" name="original_price" type="number" placeholder="0.00" defaultValue={product?.original_price} hint="Leave blank if no discount" />
          <FIELD label="Stock" name="stock" type="number" placeholder="0" defaultValue={product?.stock ?? 0} required />
        </div>
      </div>

      <div className="glass p-6 space-y-5">
        <h2 className="font-display text-xl text-white tracking-wide">Display Options</h2>
        <div className="grid grid-cols-2 gap-4">
          <FIELD label="Badge" name="badge" placeholder="HOT, NEW, SALE..." defaultValue={product?.badge} hint="Optional label shown on card" />
          <div className="flex flex-col gap-3 mt-5">
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="featured" value="true" defaultChecked={product?.featured}
                className="w-4 h-4 accent-neon rounded" />
              <span className="text-sm text-white font-body">Featured on homepage</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="is_active" value="true" defaultChecked={product?.is_active ?? true}
                className="w-4 h-4 accent-neon rounded" />
              <span className="text-sm text-white font-body">Active (visible in store)</span>
            </label>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <button type="submit" disabled={isPending} className="btn-neon py-3 px-8 text-base disabled:opacity-50">
          {isPending ? "Saving..." : isEdit ? "Save Changes" : "Create Product"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline py-3 px-6">
          Cancel
        </button>
      </div>
    </form>
  );
}
