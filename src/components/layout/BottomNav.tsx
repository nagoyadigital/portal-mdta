"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: "home", label: "Home" },
  { href: "/jadwal", icon: "calendar_month", label: "Jadwal" },
  // Center slot is the FAB scanner
  { href: "/pengumuman", icon: "campaign", label: "Info" },
  { href: "/profil", icon: "person", label: "Profil" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex items-center justify-around bg-surface px-2 pb-[env(safe-area-inset-bottom)] h-20 border-t border-outline-variant shadow-[0_-4px_15px_rgba(0,0,0,0.06)] rounded-t-2xl">
      {/* Left items */}
      {navItems.slice(0, 2).map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-0.5 transition-all duration-300 ease-in-out min-w-[56px] ${
              isActive
                ? "text-primary font-bold"
                : "text-on-surface-variant"
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={
                isActive
                  ? { fontVariationSettings: "'FILL' 1" }
                  : undefined
              }
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}

      {/* Center FAB - QR Scanner */}
      <Link
        href="/absensi/scan"
        className="relative -mt-8 flex items-center justify-center"
      >
        <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center shadow-xl border-4 border-surface transition-transform active:scale-90 hover:bg-primary-container">
          <span className="material-symbols-outlined text-on-primary text-[28px]">
            qr_code_scanner
          </span>
        </div>
        <span className="absolute -bottom-4 text-[10px] font-bold text-primary">
          Scan
        </span>
      </Link>

      {/* Right items */}
      {navItems.slice(2).map((item) => {
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-0.5 transition-all duration-300 ease-in-out min-w-[56px] ${
              isActive
                ? "text-primary font-bold"
                : "text-on-surface-variant"
            }`}
          >
            <span
              className="material-symbols-outlined text-[22px]"
              style={
                isActive
                  ? { fontVariationSettings: "'FILL' 1" }
                  : undefined
              }
            >
              {item.icon}
            </span>
            <span className="text-[10px] font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
