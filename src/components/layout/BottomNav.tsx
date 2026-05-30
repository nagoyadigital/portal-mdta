"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", icon: "home", label: "Home" },
  { href: "/jadwal", icon: "calendar_month", label: "Jadwal" },
  { href: "/absensi", icon: "how_to_reg", label: "Absensi" },
  { href: "/pengumuman", icon: "campaign", label: "Info" },
  { href: "/profil", icon: "person", label: "Profil" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center bg-surface px-2 pb-[env(safe-area-inset-bottom)] h-16 border-t border-outline-variant shadow-[0_-4px_15px_rgba(0,0,0,0.04)] rounded-t-xl">
      {navItems.map((item) => {
        const isActive =
          item.href === "/"
            ? pathname === "/"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center transition-all duration-300 ease-in-out ${
              isActive
                ? "text-primary font-bold"
                : "text-on-surface-variant hover:bg-surface-container-lowest"
            }`}
          >
            <span
              className="material-symbols-outlined"
              style={
                isActive
                  ? { fontVariationSettings: "'FILL' 1" }
                  : undefined
              }
            >
              {item.icon}
            </span>
            <span className="text-xs font-medium">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
