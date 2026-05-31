"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/layout/AppShell";

export default function ProfilPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const user = session?.user;
  const name = user?.name || "User";
  const email = user?.email || "-";
  const role = (user as unknown as { role?: string })?.role || "user";
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const roleLabel =
    role === "super_admin"
      ? "Super Admin"
      : role === "kepala_madrasah"
        ? "Kepala Madrasah"
        : role === "admin"
          ? "Admin Sekolah"
          : role === "guru"
            ? "Guru / Ustadz"
            : role === "bendahara"
              ? "Bendahara"
              : role === "wali"
                ? "Wali Santri"
                : "User";

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  return (
    <AppShell>
      {/* Profile Header */}
      <section className="flex flex-col items-center mb-8">
        <div className="relative mb-4">
          <div className="w-24 h-24 rounded-full bg-primary-fixed-dim flex items-center justify-center text-primary text-3xl font-bold border-4 border-primary">
            {initials}
          </div>
          <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full border-2 border-surface">
            <span
              className="material-symbols-outlined text-sm"
              style={{ fontVariationSettings: "'FILL' 1" }}
            >
              verified
            </span>
          </div>
        </div>
        <h2 className="font-headline text-2xl font-semibold text-on-surface">
          {name}
        </h2>
        <p className="text-sm text-on-surface-variant">{roleLabel}</p>
        <span className="mt-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-semibold">
          {roleLabel}
        </span>
      </section>

      {/* Info Cards */}
      <section className="space-y-4 mb-8">
        <div className="bg-surface-container-lowest p-5 rounded-xl card-shadow border border-outline-variant">
          <h3 className="font-headline text-lg font-semibold text-on-surface mb-4">
            Informasi Akun
          </h3>
          <div className="space-y-3">
            <InfoRow icon="email" label="Email" value={email} />
            <InfoRow icon="badge" label="Role" value={roleLabel} />
          </div>
        </div>

        <div className="bg-surface-container-lowest p-5 rounded-xl card-shadow border border-outline-variant">
          <h3 className="font-headline text-lg font-semibold text-on-surface mb-4">
            Pengaturan
          </h3>
          <div className="space-y-1">
            <MenuButton icon="lock" label="Ubah Password" />
            <MenuButton icon="notifications" label="Notifikasi" />
            <MenuButton icon="dark_mode" label="Tema Gelap" />
            <MenuButton icon="language" label="Bahasa" />
            <MenuButton icon="help" label="Pusat Bantuan" />
          </div>
        </div>
      </section>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="w-full py-4 rounded-xl border border-error text-error font-semibold text-sm flex items-center justify-center gap-2 hover:bg-error-container transition-colors"
      >
        <span className="material-symbols-outlined text-xl">logout</span>
        Keluar dari Akun
      </button>
    </AppShell>
  );
}

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-outline-variant/30 last:border-0">
      <span className="material-symbols-outlined text-primary text-xl">
        {icon}
      </span>
      <div className="flex-1">
        <p className="text-xs text-on-surface-variant">{label}</p>
        <p className="text-sm text-on-surface font-medium">{value}</p>
      </div>
    </div>
  );
}

function MenuButton({ icon, label }: { icon: string; label: string }) {
  return (
    <button className="w-full flex items-center gap-3 py-3 px-2 rounded-lg hover:bg-surface-container-low transition-colors text-left">
      <span className="material-symbols-outlined text-on-surface-variant text-xl">
        {icon}
      </span>
      <span className="text-sm font-medium text-on-surface flex-1">
        {label}
      </span>
      <span className="material-symbols-outlined text-outline text-lg">
        chevron_right
      </span>
    </button>
  );
}
