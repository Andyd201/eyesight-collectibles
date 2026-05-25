import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient, getUser } from "@/lib/supabase/server";

export const metadata = { title: "Settings" };

export default async function AccountSettingsPage() {
  const user = await getUser();

  async function updateProfile(formData) {
    "use server";
    const u = await getUser();
    if (!u) redirect("/auth/login");

    const supabase     = await createClient();
    const display_name = formData.get("display_name");
    const username     = formData.get("username")?.toLowerCase().replace(/[^a-z0-9_]/g, "") || null;

    // Save to auth user_metadata (works without profiles RLS)
    await supabase.auth.updateUser({ data: { display_name, username } });

    // Also try profiles table (may silently fail if permissions not set up)
    await supabase
      .from("profiles")
      .update({ display_name, username, updated_at: new Date().toISOString() })
      .eq("id", u.id);

    revalidatePath("/account");
    redirect("/account/settings?saved=1");
  }

  const ic = "w-full bg-surface-3 border border-border rounded-lg px-4 py-2.5 text-sm text-white placeholder-muted focus:outline-none focus:border-neon/50";
  const lc = "font-mono text-xs text-neon uppercase tracking-wider block mb-1";

  return (
    <>
      <div>
        <h2 className="font-display text-3xl text-white tracking-wide">Settings</h2>
        <p className="font-mono text-xs text-muted mt-1">Update your profile information</p>
      </div>

      <div className="glass p-6 space-y-5">
        <h3 className="font-display text-xl text-white tracking-wide">Profile</h3>

        <form action={updateProfile} className="space-y-4">
          <div>
            <label className={lc}>Display Name</label>
            <input name="display_name" type="text" placeholder="Your name" defaultValue={user?.user_metadata?.display_name ?? ""}
              className={ic} />
          </div>
          <div>
            <label className={lc}>Username</label>
            <input name="username" type="text" placeholder="collector123" defaultValue={user?.user_metadata?.username ?? ""}
              className={ic} />
            <p className="font-mono text-[10px] text-muted mt-1">Lowercase letters, numbers, and underscores only</p>
          </div>
          <div>
            <label className={lc}>Email</label>
            <input type="email" value={user?.email ?? ""} disabled
              className={`${ic} opacity-50 cursor-not-allowed`} />
            <p className="font-mono text-[10px] text-muted mt-1">Email cannot be changed here</p>
          </div>
          <button type="submit" className="btn-neon py-2.5 px-6">Save Changes</button>
        </form>
      </div>

      <div className="glass p-6 space-y-4">
        <h3 className="font-display text-xl text-white tracking-wide">Account Info</h3>
        <div className="space-y-2 font-mono text-sm">
          <div className="flex justify-between">
            <span className="text-muted">User ID</span>
            <span className="text-subtle text-xs">{user?.id?.slice(0, 8)}...</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Member since</span>
            <span className="text-white">
              {user ? new Date(user.created_at).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "—"}
            </span>
          </div>
          {user?.app_metadata?.is_admin && (
            <div className="flex justify-between">
              <span className="text-muted">Role</span>
              <span className="badge badge-gold">Admin</span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
